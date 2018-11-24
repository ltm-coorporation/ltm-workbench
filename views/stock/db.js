(function(){

    var db = new PouchDB('ltm');
    var remote = false;   
    
    var btnSave = document.getElementById('btnSave');
    
    btnSave.addEventListener('click', (event) => {
        
        if(!btnSave.getAttribute("data-rev")) return stockCreate();

        return stockUpdate();
    });
    
    function stockCreate(){

        var stock = {
            name: document.getElementById('stock[name]').value,
            sp: document.getElementById('stock[sp]').value,
            mrp: document.getElementById('stock[mrp]').value,
            unit: document.getElementById('stock[unit]').value,
            tax: document.getElementById('stock[tax]').value,
            notes: document.getElementById('stock[notes]').value
        };

        validateStock(stock);
        stock._id = new Date().toISOString();
        
        db.put(stock, function callback(err, result){
            if(!err) {
                console.log('Successfully saved');
                stockRead();
                clearForm();                  
            }
            console.log(err);
        });
    }

    function stockRead(){
        db.allDocs({
            include_docs: true,
            descending: true
        }, function(err, doc){
            if(err) return console.log(err);

            if(redrawTable(doc.rows)) return true;
            
            return false;
        });
    }
    
    function stockUpdate(){
        var stock = {
            name: document.getElementById('stock[name]').value,
            sp: document.getElementById('stock[sp]').value,
            mrp: document.getElementById('stock[mrp]').value,
            unit: document.getElementById('stock[unit]').value,
            tax: document.getElementById('stock[tax]').value,
            notes: document.getElementById('stock[notes]').value,
            _id: document.getElementById('btnSave').getAttribute('data-id'),
            _rev: document.getElementById('btnSave').getAttribute('data-rev')
        };

        db.put(stock, function(err, doc){
            if(err) return console.log(err);

            // console.log(doc);
            stockRead();
            clearForm();
            if(toggleSaveButton("save", doc)) return true;
            
             return true;
        });        
    }

    function stockDelete(docID){

        db.get(docID, function(err, doc){
            if(err) return console.log(err);

            db.remove(doc, function(err, response){
                if(err) return console.log(err);
                console.log("Document deleted");
                if(stockRead()) return true;

                return false;
            });
        })
    }

    function validateStock(stock){
        // console.log(stock);

        for(var prop in stock){
            if(stock.hasOwnProperty(prop)){
                if(!stock[prop]) {
                    // document.getElementById("stock["+prop+"]").classList.add('err-input');
                }
            }
        }
    }

    function redrawTable(stocks){
        var tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';

        stocks.forEach(stockRow => {   
            tbody.appendChild(createStockRow(stockRow.doc));
        });

        addActionClickListener();
        return true;
    }

    function createStockRow(stock){
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        
        td.innerHTML = stock.name;
        tr.appendChild(td.cloneNode(true));
        td.innerHTML = stock.sp;
        tr.appendChild(td.cloneNode(true));
        td.innerHTML = stock.mrp;
        tr.appendChild(td.cloneNode(true));
        td.innerHTML = stock.unit;
        tr.appendChild(td.cloneNode(true));
        td.innerHTML = stock.tax;
        tr.appendChild(td.cloneNode(true));
        
        td.innerHTML = "";
        var actionButton = document.createElement('button');
        actionButton.id = stock._id;
        
        actionButton.innerHTML = "Update";        
        actionButton.className = "btn btn-primary btn-update";
        td.appendChild(actionButton.cloneNode(true));

        actionButton.innerHTML = "Delete";
        actionButton.className = "btn btn-primary btn-delete";
        td.appendChild(actionButton.cloneNode(true));

        tr.appendChild(td);
        
        return tr;
    }

    stockRead();

    function addActionClickListener(){
        var btnUpdate = document.getElementsByClassName('btn-update');

        for(let i = 0; i < btnUpdate.length; i++){
            btnUpdate[i].addEventListener('click', (event) =>{                
                populateUpdateForm(btnUpdate[i]);
            });
        }

        var btnDelete = document.getElementsByClassName('btn-delete');

        for(let i = 0; i < btnUpdate.length; i++){
            btnDelete[i].addEventListener('click', (event) =>{                
                stockDelete(btnDelete[i].getAttribute('id'));
            });
        }
    }

    function populateUpdateForm(element){
        db.get(element.getAttribute("id"), function(err, doc){
            if(err) return console.log(err);
            console.log(doc);
            document.getElementById("stock[name]").value = doc.name;
            document.getElementById("stock[sp]").value = doc.sp;
            document.getElementById("stock[mrp]").value = doc.mrp;
            document.getElementById("stock[unit]").value = doc.unit;
            document.getElementById("stock[tax]").value = doc.tax;
            document.getElementById("stock[notes]").value = doc.notes;
            if(toggleSaveButton("update", doc)) return true;
            
            return false;
        });
    }
    
    function clearForm(){
        var inputFields = document.getElementsByTagName('input');
        for(let i =0; i < inputFields.length; i++){
            inputFields[i].value = "";
        }

        document.getElementById("stock[notes]").value = "";  
    }

    function toggleSaveButton(innerHtml, doc){
        if(innerHtml == "update"){
            document.getElementById("btnSave").setAttribute("data-rev", doc._rev);
            document.getElementById("btnSave").setAttribute("data-id", doc._id);
            document.getElementById("btnSave").classList.remove("btn-primary");
            document.getElementById("btnSave").classList.add("btn-success");
            document.getElementById("btnSave").innerHTML = "Update";
            return true;
        }

        if(innerHtml == "save"){
            document.getElementById("btnSave").removeAttribute("data-rev");
            document.getElementById("btnSave").removeAttribute("data-id");
            document.getElementById("btnSave").removeAttribute("class");
            document.getElementById("btnSave").setAttribute('class','btn btn-primary');
            document.getElementById("btnSave").innerHTML = "Save";
            return true;
        }

        return false;        
    }
})();