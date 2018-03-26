var UIcontroller = (function(){
    var DOMstring = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputButton : '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list',
        bugetLabel : '.budget__value',
        incomeLable :  '.budget__income--value',
        expensesLable :  '.budget__expenses--value',
        percentageLable :  '.budget__expenses--percentage',
        container : '.container',
        expensesPercLable : '.item__percentage',
        dateLable : '.budget__title--month'
    };
    var formatNumber = function (num, type) {
      var numSplit, int, dec, type;
      num =Math.abs(num);
      num = num.toFixed(2);
      numSplit = num.split('.');
      int = numSplit[0];
      dec = numSplit[1];
      if (int.length > 3) {
          int = int.substr(0,int.length - 3) + ',' + int.substr(int.length -3, 3);
      }  
      return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };
    return {
        getInput : function () {
            return {
                type : document.querySelector(DOMstring.inputType).value,  //either inc or exp
                description : document.querySelector(DOMstring.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstring.inputValue).value) 
            }
        },
        addListItem : function (obj,type) {
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMstring.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description"> %description% </div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstring.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description"> %description% </div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
        newHtml = html.replace('%id%',obj.id);
        newHtml =  newHtml.replace(' %description% ',obj.description);
        newHtml =  newHtml.replace('%value%',formatNumber(obj.value, type));
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        deleteListItem : function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields : function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstring.inputDescription + ' , '+ DOMstring.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index ,array) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        displayBuget : function (obj) {
            // console.log(obj.percentage);
            // console.log(obj.totalInc);
            // console.log(obj.totalExp);
            var type;
            obj.buget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstring.bugetLabel).textContent = formatNumber( obj.buget, type);
            document.querySelector(DOMstring.incomeLable).textContent = formatNumber( obj.totalInc, 'inc');
            document.querySelector(DOMstring.expensesLable).textContent = formatNumber( obj.totalExp, 'exp');
            if (obj.percentage >0) {
                document.querySelector(DOMstring.percentageLable).textContent = obj.percentage + '%';   
            } else {
                document.querySelector(DOMstring.percentageLable).textContent = '---'; 
            }
        },
        displayPercentages : function (percentages){
            var fields =document.querySelectorAll(DOMstring.expensesPercLable);
            var nodeListForEach = function (list,callback) {
                for(var i = 0; i<list.length; i++){
                    callback(list[i], i);
                }
            };
            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = "---";
                }
            });
        },
        displayMonth :function () {
          var now, year,month, months;
          now = new Date();
          months = ['january', 'February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];
          month = now.getMonth();
          year = now.getFullYear();
          document.querySelector(DOMstring.dateLable).textContent = months[month] + ' ' + year;  
        },
        getDOMstring : function () {
            return DOMstring;
        }
    }
})();

var Bugetcontroller = (function(){
    var Income = function (id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Expense = function (id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage =-1;
    };
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value/totalIncome)*100); 
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function () {
      return this.percentage;  
    };
    var calculateTotal = function (type) {
        var sum = 0;
        data.allItem[type].forEach(function (cur) {
           sum = sum + cur.value; 
        });
        data.totals[type] = sum;
    }
    var data = {
        allItem : {
            exp : [],
            inc : []
        },
        totals : {
            exp : 0,
            inc : 0
        },
        buget : 0,
        percentage : -1
    };
    return {
        addItem : function (type,des,val) {
            var newItem,ID;
            if (data.allItem[type].length > 0) {
                ID =data.allItem[type][data.allItem[type].length-1].id + 1;
            } else {
                ID = 0;
            }
            
            if (type === 'exp') {
                newItem = new Expense(ID,des,val);
            } else if (type === 'inc') {
                newItem = new Income(ID,des,val);
            }
            data.allItem[type].push(newItem);
            return newItem;
        },
        deleteItem : function (type, id) {
          var ids, index;
          ids = data.allItem[type].map(function(current) {
              return current.id;
          });  
          index = ids.indexOf(id);
          if (index !== -1) {
              data.allItem[type].splice(index, 1);
          }
        },
        calculateBuget : function () {
        calculateTotal('inc');
        calculateTotal('exp');
        data.buget = data.totals.inc - data.totals.exp;
        if (data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);   
        } else {
            data.percentage = -1;
        }
        },
        calculatePercentages : function () {
            data.allItem.exp.forEach(function (cur) {
               cur.calcPercentage(data.totals.inc);  
            });
        },
        getPercentages : function () {
          var allPerc = data.allItem.exp.map(function (cur){
              return cur.getPercentage();
          });  
          return allPerc;
        },
        getBuget : function () {
            return {
                buget : data.buget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
        }
    };
})();

var Controller = (function(UICtrl,bugetCtrl){
    var setEventListener = function () {
        var DOM = UICtrl.getDOMstring();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress',function (event) {
            if (event.keyCode === 13) {
                ctrlAddItem();
                
            }
        });  
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    var updateBuget = function () {
        //calculate buget
        bugetCtrl.calculateBuget();
        // return buget 
        var buget = bugetCtrl.getBuget();
        // display buget in UI 
        console.log(buget);
         UICtrl.displayBuget(buget);
    } ;
    var updatePercentages = function () {
        // calculate percentage
        bugetCtrl.calculatePercentages();
        // read percentages from the buget controller
        var percentages = bugetCtrl.getPercentages();
        // update the UI with the new percentage
        UICtrl.displayPercentages(percentages);
    };
    var ctrlAddItem = function () {
        var newItem,input;
        // get the field input data
        input = UICtrl.getInput();
        if (input.description !=="" && !isNaN(input.value) && input.value > 0) {
            // add the item to the budget controller
            newItem = bugetCtrl.addItem(input.type,input.description,input.value);
            // add the item to the UI
            UICtrl.addListItem(newItem,input.type);
            // clear the fields
            UICtrl.clearFields();
            // calculate and update buget
            updateBuget();    
            // calculate and update percentage
            updatePercentages();
        }
       
    };
    var ctrlDeleteItem = function (event) {
        var itemID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID);
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // delete the item form the data structure
            bugetCtrl.deleteItem(type,ID);
            // delete the item from UI
            UICtrl.deleteListItem(itemID);
            // update and show the new buget
            updateBuget();
            // calculate and update percentage
            updatePercentages();
        }
    };
    return {
        init : function() {
            console.log('Application has sarted');
            UICtrl.displayMonth();
            UICtrl.displayBuget({
                buget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage : -1
            });
            setEventListener();
        }
    };
})(UIcontroller,Bugetcontroller);
Controller.init();