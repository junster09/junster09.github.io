
const CHAR_FILE_EXTENTION = "nsc"
const CHAR_DEFAULT_SKILL_LIMIT = 10


const DICE = [
    "d5", //0 Combat Die
    "d10!", //1 Non Combat Die
    "d5", //2 Prepared Die
    "d5" //3 Dazed die
]

const CONSEQUENCE_TYPE = {
    TEMPORARY: 0,
    MILD: 1,
    MODERATE: 2,
    SEVERE: 3,
    EXTREME: 4,
    FATE_ALTERING: 5
}

const CONSEQUENCE_TYPE_STRING = [
    "Temporary",
    "Mild",
    "Moderate",
    "Severe",
    "Extreme",
    "Fate Altering"
]



const PREPARED_DICE_MINIMUM = 3;
const DAZED_DICE_MAXIMUM = 3;

//colors
const BUTTON_ACTIVE_COLOR = "#005fff"
const BUTTON_INACTIVE_COLOR = "#4e6a99"
const STRESS_BOX_ACTIVE_COLOR = "#e89090"

//
const CHARACTER_TABLE_HEADER_NAMES = ["Skill","Rank","Level","Used"]
const FIELD_TABLE_HEADER_NAMES = ["Weight","Name","Free Invoke",""]
const FIELD_TABLE_DATA_TYPES = ["number","text","number"]
class SkillRank{
    constructor(_name,_color,_maxLevel){
        this.name = _name
        this.color = _color
        this.maxLevel = _maxLevel
    }
}

const skillRankDetails = []
skillRankDetails[0] = new SkillRank("UNK","#ffffff",9999)
skillRankDetails[1] = new SkillRank("Tin","#b36e00",5)
skillRankDetails[2] = new SkillRank("Bronze","#b36e00",10)
skillRankDetails[3] = new SkillRank("Silver","#a8a8a8",20)
skillRankDetails[4] = new SkillRank("Gold","#ffe882",30)

const SkillRanks = {
    UNK: 0,
    TIN: 1,
    BRONZE: 2,
    SILVER: 3,
    GOLD: 4,
}


//Invokables are things that could be invoked (boosts/debuffs/consequences)
class Invokable{
    constructor(_name,_weight,_freeInvokeCount){
        if(_name == null){this.name = ""}else{this.name = _name}
        if(_weight == null){this.weight = 0}else{this.weight = _weight}
        if(_freeInvokeCount == null){this.freeInvokeCount = 0}else{this.freeInvokeCount = _freeInvokeCount}
    }

    invoke(){
        if(this.weight >= 0){
            return ("+" + this.weight)
        }else{
            return ("-" + Math.abs(this.weight))
        };
    }

    countdown(_amount){
        this.freeInvokeCount = this.freeInvokeCount - _amount
    }

    getName(){return this.name}
    setName(_name){this.name = _name}

    getWeight(){return this.weight}
    setWeight(_weight){this.weight = _weight}

    getFreeInvokeCount(){return this.freeInvokeCount}
    setFreeInvokeCount(_amount){this.freeInvokeCount = _amount}
}

class Consequence extends Invokable{
    constructor(_name,_weight,_freeInvokeCount,_consequenceType){
        super(_name,_weight,_freeInvokeCount)
        this.severity = _consequenceType
    }

    getSeverity(){return this.severity}
    getSeverityString(){return CONSEQUENCE_TYPE_STRING[this.severity]}

    
}
//basic skills have informatoin about skills
class BasicSkill {
    constructor(){
        this.name = "";
        this.rank = SkillRanks.UNK;
        this.level = 0;
        this.timesUsedSinceLastLevel = 0;
    }

    isSkill(){return true}
    getName(){return this.name;}
    setName(_name){this.name = _name;}

    getRank(){return this.rank;}
    setRank(_rank){
        if(skillRankDetails[_rank] == null){
            this.rank = SkillRanks.UNK
        }else{
            this.rank = _rank;
        }
        
    }

    getLevel(){return this.level;}
    setLevel(_level){

        if(_level > skillRankDetails[this.rank].maxLevel){
            this.level = this.level % skillRankDetails[this.rank].maxLevel
            this.setRank(this.rank + 1)
        } else{
            this.level = _level
        }

        this.setTimesUsed(0)
    }

    getTimesUsed(){return this.timesUsedSinceLastLevel;}
    setTimesUsed(_timesUsed){this.timesUsedSinceLastLevel = _timesUsed}

    init(_name,_rank,_level,_timesUsed){
        this.setName(_name);this.setRank(_rank);this.setLevel(_level);this.setTimesUsed(_timesUsed);
    }

    printData(){
        return "Name: " + this.name + "\nRank" + this.rank + "\nlevel"
        + this.level + "\nTimes Used This Level: " + this.timesUsedSinceLastLevel;
    }
}

class Character{
    constructor(){
        this.name = "";
        this.skills = [];
        this.skillLimit = CHAR_DEFAULT_SKILL_LIMIT;
        this.stressBoxes = [false,false,false,false]
        this.consequences = ["NONE","NONE","NONE","NONE"]
        this.maxFatePoints = 2
        this.currentFatePoints = this.maxFatePoints
    }

    isChar(){return true}

    init(_name){
        this.name = _name
    }

    addSkill(_skillSlot,_skill){
        if (_skill != null && _skillSlot <= this.skillLimit) {
            this.skills[(_skillSlot - 1)] = _skill;
        }
    }
    setSkills(SkillList){
        for(let i=0;i<SkillList.length;i++){
            this.skills[i] = SkillList[i];
        }
    }

    overwriteCharacterFromObject(newChar){
        //if (newChar.isChar == null){console.log("Character overwrite failed");return false;}
        this.name = newChar.name;
        this.skillLimit = newChar.skillLimit;
        this.stressBoxes = newChar.stressBoxes;
        this.consequences = newChar.consequences;
        this.maxFatePoints = newChar.maxFatePoints;
        this.currentFatePoints = newChar.currentFatePoints;

        for(let i=0;i<newChar.skills.length;i++){
            let e = newChar.skills[i]
            let tempSkill = new BasicSkill()
            tempSkill.init(e.name,e.rank,e.level,e.timesUsedSinceLastLevel)
            this.addSkill((i+1),tempSkill)
        }

        return true

    }

    getName(){return this.name;}
    getSkillLimit(){return this.skillLimit;}
    getSkills(){return this.skills;}
    getConsequences(){return this.consequences;}
    getStressBoxes(){return this.stressBoxes;}
    setStressBoxes(input){
        this.stressBoxes = input
    }
    setStressBox(pos,state){
        if(this.stressBoxes[pos] == null){return false;}

        this.stressBoxes[pos] = state
    }

    incrementSkillUsage(_skillslot,_amount){
        if(this.skills[i] == null){
            return false;
        }

        this.skills[i].setTimesUsed((this.skills[i].getTimesUsed() + _amount));
        return true;
    }

}
class CharCreateSkillButton{
    constructor(_parent,_skillSlot,_char){
        this.parent = _parent
        this.skillSlot = _skillSlot
        if (_char != null){this.char = _char}else{this.skill = new Character()}
        this.buttonListener = null
        this.skillRef = this.char.getSkills()[_skillSlot]
        this.htmlBox = null
    }

    buildButton(){
        this.htmlBox = document.createElement("DIV")
        this.htmlBox.class = "skillCreateSkill"
        this.htmlBox.id = "skillCreate" + this.skillSlot

        const nameLabel = document.createElement("LABEL")
        nameLabel.htmlFor = "skillName" + this.skillSlot
        nameLabel.innerHTML = "[" + (this.skillSlot + 1) + "]"

        const nameInput = document.createElement("INPUT")
        nameInput.type = "text"
        nameInput.id = "skillName" + this.skillSlot
        nameInput.name = nameInput.id
        nameInput.placeholder = "skill name"
        nameInput.size = "10"

        const rankSelector = document.createElement("SELECT");rankSelector.name = "skillRank" + this.skillSlot;
        for(let i=0;i<skillRankDetails.length;i++){
            const e = document.createElement("OPTION")
            e.value = i
            e.innerHTML = skillRankDetails[i].name
            rankSelector.appendChild(e)
        }

        const levelLabel = document.createElement("LABEL")
        levelLabel.htmlFor = "skillLevel" + this.skillSlot
        levelLabel.innerHTML = "Level:"

        const levelInput = document.createElement("INPUT")
        levelInput.type = "number"
        levelInput.id = "skillLevel" + this.skillSlot; levelInput.name = levelInput.id
        levelInput.placeholder = 0
        levelInput.min = 0
        levelInput.max = 999
        levelInput.step = 1

        const usedLabel = document.createElement("LABEL")
        usedLabel.htmlFor = "skillUsed" + this.skillSlot
        usedLabel.innerHTML = "Used:"
        const usedInput = document.createElement("INPUT")
        usedInput.type = "number"
        usedInput.id = "skillUsed" + this.skillSlot; levelInput.name = levelInput.id
        usedInput.placeholder = 0
        usedInput.min = 0
        usedInput.max = 999
        usedInput.step = 1

        const br = document.createElement("BR")


        this.htmlBox.appendChild(nameLabel)
        this.htmlBox.appendChild(nameInput)

        this.htmlBox.appendChild(rankSelector)
        this.htmlBox.appendChild(br)

        this.htmlBox.appendChild(levelLabel)
        this.htmlBox.appendChild(levelInput)

        this.htmlBox.appendChild(usedLabel)
        this.htmlBox.appendChild(usedInput)

        this.parent.appendChild(this.htmlBox)

        const inputRefs = {
            name: nameInput,
            rank: rankSelector,
            level: levelInput,
            used: usedInput
        }

        return inputRefs

    }

    deleteButton(){

    }
}


class CharacterTable{
    //_parent is the div to add into, _character is charater
    constructor(_parent,_character){
        this.parent = _parent
        this.character = _character
        this.usageButtons = []
        this.levelButtons = []
    }

    updateCharacter(_character){
        this.character = _character
    }

    buildTable(){
        this.htmlTable = document.createElement("table");
        this.htmlTableBody = document.createElement("tbody");
        //SkillTable is an array of refrences mirroring the actual table
        this.skillTable = []

        /*
        it should look like:

        [0] : [cellRef,cellRef,cellRef,cellRef]
        [1] : [cellRef,cellRef,cellRef,cellRef]
        etc...
        */

        //create header
        const headerRow = document.createElement("tr");
        for(let i=0; i < CHARACTER_TABLE_HEADER_NAMES.length; i++){
            const cell = document.createElement("th");
            cell.innerHTML = CHARACTER_TABLE_HEADER_NAMES[i];
            headerRow.appendChild(cell);
        }

        this.htmlTableBody.appendChild(headerRow);

        //create skill list
        let charSkills = this.character.getSkills();
        //make rows
        for(let i=0; i < CHAR_DEFAULT_SKILL_LIMIT; i++){
            const row = document.createElement("tr");
            this.skillTable[i] = []
            let skill = charSkills[i];
            let details = [];
            
            if(skill == null){
                details = ["NONE","X","X","X"]
            }else{
                details[0] = skill.getName();
                details[1] = skillRankDetails[skill.getRank()].name;
                details[2] = skill.getLevel();
                details[3] = skill.getTimesUsed();
            }

            for(let j=0; j < details.length; j++){
                const cell = document.createElement("td");

                var container;
                var text;
                var button;

                switch (j){

                    case 2: //level button

                        container = document.createElement("div");
                        container.className = "CharSheetDiv"

                        text = document.createElement("div");
                        text.className = "incrementButtonText"
                        text.innerHTML = details[j]
                        container.appendChild(text);

                        button = document.createElement("button");
                        button.className = "incrementButton"
                        button.innerHTML = "^"

                        container.appendChild(button);
                        cell.appendChild(container);

                        this.skillTable[i][j] = text
                        this.levelButtons[i] = button
                        break;

                    case 3: //increment button

                        container = document.createElement("div");
                        container.className = "CharSheetDiv"

                        text = document.createElement("div");
                        text.className = "incrementButtonText"
                        text.innerHTML = details[j]
                        container.appendChild(text);

                        button = document.createElement("button");
                        button.className = "incrementButton"
                        button.innerHTML = "^"

                        container.appendChild(button);
                        cell.appendChild(container);

                        this.skillTable[i][j] = text
                        this.usageButtons[i] = button
                        break;

                    default:
                        cell.innerHTML = details[j];
                        this.skillTable[i][j] = cell
                }
                
                row.appendChild(cell)
                
            }

            this.htmlTableBody.appendChild(row)
        }

        this.htmlTable.appendChild(this.htmlTableBody);
        this.parent.appendChild(this.htmlTable);

    }

    updateTable(){
        //get table refrences:

        for(let i=0; i < this.skillTable.length; i++){
            let skill = this.character.getSkills()[i];
            let details = [];
            
            if(skill == null){
                details = ["NONE","X","X","X"]
            }else{
                details[0] = skill.getName();
                details[1] = skillRankDetails[skill.getRank()].name;
                details[2] = skill.getLevel();
                details[3] = skill.getTimesUsed();
            }

            for(let j=0; j < details.length; j++){
                const cell = this.skillTable[i][j];
                cell.innerHTML = details[j];
            }
        }
    }
}
class FieldTable{

    constructor(_parent,_fieldTable){
        this.parent = _parent
        if(_fieldTable != null){

        }else{
            this.fieldTable = []
        }

        this.inputRefs = []
    }

    addLine(_invokeToAdd){

    }

    buildTable(){
        //nav header

        //table Container/body
        this.htmlTable = document.createElement("table");
        this.htmlTableBody = document.createElement("tbody");

        //Table Headers
        const headerRow = document.createElement("tr");
        for(let i=0; i < FIELD_TABLE_HEADER_NAMES.length; i++){
            const cell = document.createElement("th");
            cell.innerHTML = FIELD_TABLE_HEADER_NAMES[i];
            headerRow.appendChild(cell);
        }
        this.htmlTableBody.appendChild(headerRow);

        //body will be populated later

        

        //add "add new line" (it's actually just another table lmao)
        this.newLineTable = document.createElement("table");
        this.newLineTableBody = document.createElement("tbody");
        this.newLineInputRefrences = []
        const newLineHeaderRow = document.createElement("tr");

        for(let i=0; i < (FIELD_TABLE_HEADER_NAMES.length - 1); i++){
            const cell = document.createElement("th");
            cell.innerHTML = FIELD_TABLE_HEADER_NAMES[i];
            newLineHeaderRow.appendChild(cell);
        }

        this.newLineTableBody.appendChild(newLineHeaderRow)
        const inputRow = document.createElement("tr")

        for(let i=0; i < (FIELD_TABLE_HEADER_NAMES.length - 1); i++){
            const cell = document.createElement("td");
            cell.name = FIELD_TABLE_HEADER_NAMES[i] + " cell"

            const inputContainer = document.createElement("div");
            inputContainer.name = FIELD_TABLE_HEADER_NAMES[i] + " input container"

            const inputField = document.createElement("input");
            inputField.type = FIELD_TABLE_DATA_TYPES[i]

            this.inputRefs[i] = inputField

            inputContainer.appendChild(inputField)
            cell.appendChild(inputContainer)
            inputRow.appendChild(cell)
        }

        this.newLineTableBody.appendChild(inputRow)
        this.newLineTable.appendChild(this.newLineTableBody)

        //weight

        //add new button
        this.addNewButton = document.createElement("button");
        this.addNewButton.innerHTML = "ADD NEW FIELD"

        //append in order
        
        this.parent.appendChild(this.htmlTableBody)
        this.parent.appendChild(this.newLineTable)
        this.parent.appendChild(this.addNewButton)
        
    }

    updateTable(){
    
    }


}