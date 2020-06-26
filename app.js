// 1: create modules for each component
var budgetController = (function(){
    
    // 6 : Create classes for both income and expense
    var Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr) {
            sum += curr.value;
        });
        data.totals[type] = sum;
    }

    // 7 : Our data structure to store the objects of the above Classes/Constructors
    var data = {
        allItems : {
            exp: [],
            inc : [],
        },
        totals : {
            exp : 0,
            inc : 0,
        },
        budget : 0,
        percentage : -1
    };

    return {
        // 8 : Create an add item function to add items into our data structure using the functions
        // constructors
        addItem : function(type,des,val){
            var newItem,ID;
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === "exp"){
                newItem = new Expense(ID,des,val);
            } else if (type === "inc") {
                newItem = new Income(ID,des,val);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type,id){
            var ids = data.allItems[type].map(function(curr){
                return curr.id;
            });
            var index = ids.indexOf(id);
            if (index !== -1){
                data.allItems[type].splice(index,1);
            }
        },

        calculateBudget : function(){
            calculateTotal("inc");
            calculateTotal("exp");

            data.budget = data.totals.inc - data.totals.exp;
            if (data.totalInc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        getBudget : function(){
            return {
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                budget : data.budget,
                percentage : data.percentage
            }
        },

        testing : function(){
            return data;
        }
    };
})();




// 1: create modules for each component
var UIController = (function(){
    
    // Private data
    var DOMStrings = {
        inputType : ".add__type",
        inputDescription : ".add__description",
        inputValue : ".add__value",
        addBtn : ".add__btn",
        incomeElement : ".income__list",
        expensesElement : ".expenses__list",
        budgetLabel : ".budget__value",
        incomeLabel : ".budget__income--value",
        expenseLabel : ".budget__expenses--value",
        percentageLabel : ".budget__expenses--percentage",
        monthLabel : ".budget__title--month",
        contaier : ".container"
    }
    

    // Public data
    //4 : Get the input values from the html document
    return {
        getInput : function (){
            return {
                type : document.querySelector(DOMStrings.inputType).value,
                description : document.querySelector(DOMStrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        getDOMStrings : function(){
            return DOMStrings;
        },

        // 9 : create a addListItem function to present the new items on the DOM
        addListItem : function(obj,type){
            var html,newHtml,element;
            if (type === "inc"){
                element = DOMStrings.incomeElement;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === "exp"){
                element = DOMStrings.expensesElement;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml = html.replace("%id%",obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

        },
        // 10 clear fields
        clearFields : function(){
            var fields = document.querySelectorAll(DOMStrings.inputDescription + ", " + DOMStrings.inputValue);
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(curr,index,arr){
                curr.value = "";
            });
            fieldsArr[0].focus();
        },
        displayBudget : function(obj){
            if (obj.budget > 0){
                document.querySelector(DOMStrings.budgetLabel).textContent = "+ " + obj.budget;
            } else {
                document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            }

            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
            if (obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + " %";
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }
        },
        deleteListItem : function(selectorId){
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);
        },


        displayMonth : function(){
            var currMonth = new Date().getMonth();
            var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
            document.querySelector(DOMStrings.monthLabel).textContent = months[currMonth];
        }
    };
})();






// 1: create modules for each component and assign the other modules to this one
var controller = (function(budgetCtrl,UICtrl){
    
    var updateBudget = function(){
        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getBudget();
        UICtrl.displayBudget(budget);
    };
    
    
    // Delete items
    var ctrlDeleteItem = function(event){
        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        var splitID = itemID.split("-");
        var ID = parseInt(splitID[1]);
        var type = splitID[0];
        budgetCtrl.deleteItem(type,ID);
        UICtrl.deleteListItem(itemID);
        updateBudget();
    }
    
    
    // 3: create a generic function which will be called when the buttons are clicked
    var ctrlAddItem = function(){
        // 5 : Get the inputs from the UI controller
        var input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            var newItem = budgetCtrl.addItem(input.type,input.description,input.value);
            UICtrl.addListItem(newItem,input.type);
            UICtrl.clearFields();
            updateBudget();
        } 
    };

    var reset = function(){
        var resetObj = {
            totalInc : 0,
            totalExp : 0,
            budget : 0,
            percentage : -1
        }
        UICtrl.displayBudget(resetObj);
    }; 
    

    var start = function (){
        // 2: assign actions for the buttons using click and keypress
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.addBtn).addEventListener("click",ctrlAddItem);
        document.addEventListener("keypress", function(event){
            if (event.keyCode === 13){
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.contaier).addEventListener("click",ctrlDeleteItem);
    }

    return {
        init : function(){
            reset();
            UICtrl.displayMonth();
            start();
        }
    }


})(budgetController,UIController);


controller.init();