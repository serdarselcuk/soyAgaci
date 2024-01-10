
// base object structure
class root_1 {
    constructor(name,dogum, dogumyeri, olum, esi, children = [], Esinin_Soyadi, Esinin_Babasi, Telefon, Email, Fotograf, Nesil ){
            this.name = name || ""; 
            this.dogum = dogum || ""; 
            this.dogumyeri = dogumyeri || ""; 
            this.olum = olum || ""; 
            this.esi = esi || ""; 
            this.children = children || ""; 
            this.Esinin_Soyadi = Esinin_Soyadi || ""; 
            this.Esinin_Babasi = Esinin_Babasi || ""; 
            this.Telefon = Telefon || 0; 
            this.Email = Email || ""; 
            this.Fotograf = Fotograf || ""; 
            this.Nesil = Nesil || 0;
    }

    addChild(child) {
        this.children.push(child);
      }

    mapJson(rootJson){
       return new root_1(
        rootJson["Adi"]+" "+rootJson["Soyadi"],
        rootJson["Dogum Tarihi"],
        rootJson["Dogum Yeri"],
        rootJson["Olum Tarihi"],
        rootJson["Eşinin Adi"],
        [],
        rootJson["Esinin Soyadi"],
        rootJson["Esinin Babasi"],
        rootJson["Telefon"],
        rootJson["Email"],
        rootJson["Fotograf"],
        rootJson["Nesil"] 
       );
    }
}
 
// below function will create json with people date read from excel by finding parent-child relationship

function orderPeople(objList){
    var rootObject;
    try {
        var rootJson = objList.find(p => p.Nesil == 1 && p["Baba Adi"] === undefined && p["Anne Adi"] === undefined);
        rootObject = new root_1().mapJson(rootJson); 
    } catch (error) {
        console.log(rootJson + "root obj thrown error\n"+ error)
    }
   
    joinObj(rootObject, objList, 2);

    return rootObject;
}

// adding childs to parents
function joinObj(root, objList, nesil){
    if(objList.find(p=>p.Nesil)===undefined) {
        return null};

    objList.forEach(p => {
        try {
            
            if(nesil==p.Nesil){
                if(validatePerson(p["Baba Adi"], root.name)){
                    var person = new root_1().mapJson(p);
                    root.addChild(person);
                    joinObj(person, objList, nesil+1);
                }
            }    
        } catch (error) {
            console.log(p+" thrown error\n"+ error)
        }
       
    });

}

// validating the name if it is matching. 
function validatePerson(name_1, name_2){
    console.log(name_1,name_2);
    let array_1 = name_1.split(" ");
    let array_2 = name_2.split(" ");

    return array_1[0]==array_2[0];
}

