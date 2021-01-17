// Budget Controller
var budgetController = (function(){

   var Expense = function(id, description, value){
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
   };

   Expense.prototype.calculatePercentages = function(totalIncom){

      if(totalIncom > 0){
         this.percentage = Math.round((this.value/ totalIncom)*100);
      }else{
         this.percentage = -1;
      }
   };

   Expense.prototype.getPercentages = function(){
      return this.percentage;
   }

   var Income = function(id, description, value){
       this.id = id;
      this.description = description;
      this.value = value;
   };
   
   var calculateTotal = function(type){
      var sum = 0;
      data.allItems[type].forEach(function(cur){
         sum += cur.value;
      });
      data.totals[type] = sum;


   };
 
   
   var data = {
      allItems:{
         exp:[],
         inc:[]
      },
      totals:{
         exp:0,
         inc:0
      },
      del:{
         exp:[],
         inc:[]
      },
   
      budget: 0,
      percentage: 0,
      incpercentage:0
  
   };

   return{
      addItem:function( type, des, val){
         var newItem, Id;
        

         // Create new Id
         if(data.allItems[type].length > 0){
             Id = data.allItems[type][data.allItems[type].length -1].id + 1;
         }else{
             Id = 0;
         };
        


         //Create new item based on "inc" or "exp" type
         if(type ==="exp"){
            newItem = new Expense(Id, des, val)
         }else if(type === "inc"){
            newItem = new Income(Id, des, val)
         };


         // push it into our data structure
       data.allItems[type].push(newItem);

       //Return the new element
         return newItem;
       
      },

      deleteItem: function(type, id){
         var ids, index, deleteItem;

       ids = data.allItems[type].map(function(current){
         return current.id;
       });

         index = ids.indexOf(id);
     

         if  (index !== -1){
           deleteItem =   data.allItems[type].splice(index, 1);
          deleteItem = deleteItem[0]
         data.del[type].push(deleteItem);
         return deleteItem;
    

         }

      },

      calculateBudget: function(){
         // calculate total income and expenses
         calculateTotal("inc");
         calculateTotal("exp");
        
         // Calculate the budget : income - expenses
         data.budget = data.totals.inc - data.totals.exp;
        
         // calculate the percentage of incom
       if (data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        }else{
            data.percentage = 0;
         };

         // calculate the percentage of incom
         data.incpercentage = 100 - data.percentage;

      },

      calculatePercentages: function(){
         data.allItems.exp.forEach(function(cur){
            cur.calculatePercentages(data.totals.inc);

         });

      },
      getPercentages: function(){
         var allPerc = data.allItems.exp.map(function(cur){
            return cur.getPercentages();
         });
         return allPerc;
      },

      getBudget:function(){
         return{
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage,
            incpercentage: data.incpercentage


         };
      },
       
      texsting: function(){
         console.log(data);
      }
   };


})(); 


// UI controller 

var UIController = (function(){  
   
   var DOMstrings = {
      inputType: ".add_type",
      inputDescription: ".add_description",
      inputValue: ".add_value",
      inputBtn: ".add_btn",
      incomeContainer: ".income_list",
      expenseContainer:".expenses_list",
      budgetLabel: ".budget_value",
      incomLabel: ".budget_income_value",
      expensesLabel: ".budget_expenses_value",
      percentageLabel:".budget_expenses_percentage",
      incompercentageLabel: ".budget_income_percentage",
      container:".inc-exp-container",
      expensesPercLabel:".item_percentage",
      dateLabel: ".budget_title_month",

      delincomeContainer: ".del_income_list",
      delexpenseContainer:".del_expenses_list"
  
    

      
   }; 

  var  formateNumber =  function(num, type){
      var numsplit, int, des, type;
      // + or - before number 
      num = Math.abs(num);
      num = num.toFixed(2);
      numsplit = num.split(".")

      int = numsplit[0];
      if (int.length > 3) {
         int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
      }
      des = numsplit[1];
      // type === "exp" ? sing = "-" : sing = "+";

      return (type === "exp" ? "-" : "+") + " " + int + "." + des;

   }
    
   

   return {
      getinput: function(){
         return{
            type: document.querySelector('.add_type').value,
            description: document.querySelector(".add_description").value,
            value: parseFloat(document.querySelector(".add_value").value) 
         };
         
      },
      // sdfhkjkfjad

      adddeltItem: function(obj, type){

         var html, newHtml, element; 
         // Create HTML string with placeholder text
         if (type === "inc"){
               element = DOMstrings.delincomeContainer;

                html = '<div class="item p-2 d-flex" id="inc-%id%"><div class="item_description flex-fill">%description%</div><div class="item_value  justify-content-end text-success">%value%</div><div class="item_delete"><button class="item_delete_btn"><i class="fas fa-times"></i></button></div></div>';
         }else if (type === "exp"){
               element = DOMstrings.delexpenseContainer;

               html = '<div class="item p-2 d-flex" id="exp-%id%"><div class="item_description flex-fill">%description%</div><div class="item_value  justify-content-end text-danger">%value%</div> <div class="item_percentage"></div><div class="item_delete"><button class="item_delete_btn"><i class="fas fa-times"></i></button></div></div>';
         }

         // Replace the placeholder text with some actua data
               newHtml = html.replace("%id%", obj.id);
               newHtml = newHtml.replace("%description%", obj.description);
               newHtml = newHtml.replace("%value%",formateNumber(obj.value, type) );
             

         // Insert the HTML into the DOM
         document.querySelector(element).insertAdjacentHTML("beforebegin", newHtml);
      },
     
// dreoi
      addListItem: function(obj, type){

         var html, newHtml, element; 
         // Create HTML string with placeholder text
         if (type === "inc"){
               element = DOMstrings.incomeContainer;

                html = '<div class="item p-2 d-flex" id="inc-%id%"><div class="item_description flex-fill">%description%</div><div class="item_value  justify-content-end text-success">%value%</div><div class="item_delete"><button class="item_delete_btn"><i class="fas fa-times"></i></button></div></div>';
         }else if (type === "exp"){
               element = DOMstrings.expenseContainer;

               html = '<div class="item p-2 d-flex" id="exp-%id%"><div class="item_description flex-fill">%description%</div><div class="item_value  justify-content-end text-danger">%value%</div> <div class="item_percentage"></div><div class="item_delete"><button class="item_delete_btn"><i class="fas fa-times"></i></button></div></div>';
         }

         // Replace the placeholder text with some actua data
               newHtml = html.replace("%id%", obj.id);
               newHtml = newHtml.replace("%description%", obj.description);
               newHtml = newHtml.replace("%value%",formateNumber(obj.value, type) );
             

         // Insert the HTML into the DOM
         document.querySelector(element).insertAdjacentHTML("beforebegin", newHtml);
      },
    
         // Delete the item for UI 
      deleteListItem: function(selectorId){
         var el = document.querySelector("#"+selectorId);
            el.parentNode.removeChild(el);
          
         
      },
      
      clearFields: function(){
         var fields, fieldsArr;
          
         fields = document.querySelectorAll(DOMstrings.inputDescription + "," + DOMstrings.inputValue);
      
           fieldsArr = Array.prototype.slice.call(fields);
         
         fieldsArr.forEach(function(current, index, array){
            current.value = "";
          });
          fieldsArr[0].focus();

         },

         displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = "inc" : type = "exp";
            document.querySelector(DOMstrings.budgetLabel).textContent= formateNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomLabel).textContent= formateNumber(obj.totalInc, "inc");
            document.querySelector(DOMstrings.expensesLabel).textContent= formateNumber(obj.totalExp, "exp");
            document.querySelector(DOMstrings.percentageLabel).textContent= obj.percentage + "%";
            document.querySelector(DOMstrings.incompercentageLabel).textContent= obj.incpercentage + "%";
            

         },

         displayPercentages: function(percentage){
            var fields  = document.querySelectorAll(DOMstrings.expensesPercLabel);
             var nodeListForEach = function(list, calback){
                for(var i = 0; i< list.length; i++){
                   calback(list[i], i)
                } 
             };
             nodeListForEach(fields, function(cur, index){
                if (percentage[index] > 0){
                   cur.textContent = percentage[index] + "%";
                }else{
                   cur.textContent= "---";
                } 
             });
 
         },

         displayMonth:function(){
            var now, year;
               now = new Date();
               days =["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
               day = now.getDay();
               date = now.getDate();
               month = now.getMonth();
               months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 
               year = now.getFullYear();
               document.querySelector(DOMstrings.dateLabel).textContent =days[day] + " " + date+ " " + months[month] + " "  +  year;


         },

      getDOMstrings: function(){
         return DOMstrings;
      }
   };


})();


 


//global app controller
var controller = (function(budgetCtrl, UICtrl){

      var setupEventlistener = function(){
         
         var DOM = UICtrl.getDOMstrings();
         document.querySelector(DOM.inputBtn).addEventListener("click", CtrlAddItem);

         document.querySelector(DOM.inputType).addEventListener("change", function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOM.inputType + "," + DOM.inputDescription+ "," + DOM.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(element, index, array){

               element.classList.toggle("form-control-red");
             document.querySelector(DOM.inputBtn).classList.toggle("add_btn_red");
            });

         },);
             
 
         

         document.addEventListener("keypress", function(event){    
            if(event.keyCode === 13 || event.which === 13){
             CtrlAddItem();
            }
         });

         document.querySelector(DOM.container).addEventListener("click", ctrDeleteItem);
      };

      var updateBudget = function(){
         //1. Calculate the budget
         budgetCtrl.calculateBudget();
         //2. Return the budget
         var budget = budgetCtrl.getBudget();
        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);
        
      

      };
      var updatePercentages = function(){
         // Calculate percentages
         budgetCtrl.calculatePercentages();


         // 2. Read percentages froom the budget 
         var percentage = budgetCtrl.getPercentages();

         // 3. Update the UI with the new percentages
         UICtrl.displayPercentages(percentage);
      };


      var CtrlAddItem = function(){
         var input, newItem;

          //1. Get the filed input data
         input = UICtrl.getinput();

         if (input.description !== "" && !isNaN(input.value) && input.value > 0 ){
          //2. Add the item to the budget controller
         newItem = budgetCtrl.addItem(input.type, input.description, input.value)

         //3. Add the item to the UI
          UICtrl.addListItem(newItem, input.type);

 
          // 4. Clrar the fields
             UICtrl.clearFields();
 
          //5. Calculate and update budget
             updateBudget();

         // 6. Calcutate and update percentages
            updatePercentages();
         }

      }; 

      var ctrDeleteItem = function(event){
         var itemId, splitId, type, Id, delItem;
         
         itemId = event.target.parentNode.parentNode.parentNode.id;
       // data strucure delete function
         if (itemId){
               splitId = itemId.split("-");
               type = splitId[0];
               Id = parseInt(splitId[1]);
         
         // 1. delete the item from the data strucure
         delItem = budgetCtrl.deleteItem(type, Id);
        UICtrl.adddeltItem(delItem, type);

         // 2. Delete the item from the UI
         UICtrl.deleteListItem(itemId);

         //3. Update and show thw new budget
         updateBudget();

         // 4. Calcutate and update percentages
         updatePercentages();
      };
      
      };
   




      return {
         init: function(){
            console.log("Application has started");
            UICtrl.displayMonth();
            UICtrl.displayBudget(budgetCtrl.getBudget());
            setupEventlistener();
         }
      }

})(budgetController, UIController);

controller.init();


