(function(){

    var db = new PouchDB('ltm');
    var remote = false;   
    
    document.getElementById('btnSave')
        .addEventListener('click', (event) => {
            stockCreate();
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

       console.log(stock);

       stock._id = new Date().toISOString();
        
        db.put(stock, function callback(err, result){
            if(!err) {
                console.log('Successfully saved');
                stockRead();

                var inputFields = document.getElementsByTagName('input');
                for(let i =0; i < inputFields.length; i++){
                    inputFields[i].value = "";
                }

                document.getElementById("stock[notes]").value = "";                    
            }
        });
    }

    function stockRead(){
        db.allDocs({
            include_docs: true,
            descending: true
        }, function(err, doc){
            // console.log(doc.rows);
            redrawTable(doc.rows);
            
        });
    }
    function stockUpdate(){}
    function stockDelete(){}

    function redrawTable(stocks){
        var tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';

        // stocks.forEach(function(element){
        //     console.log(element);
        // });
        stocks.forEach(stockRow => {   
            // console.log(stockRow.doc);
            tbody.appendChild(createStockRow(stockRow.doc));
        });

        addUpdateClickListener();
    }

    function createStockRow(stock){
        var tr = document.createElement('tr');
        var td = document.createElement('td');

        td.innerHTML = stock.name;
        tr.appendChild(td.cloneNode(true));
        td.innerHTML = stock.sp;
        tr.appendChild(td.cloneNode(true));
        td.innerHtml = stock.mrp;
        tr.appendChild(td.cloneNode(true));
        td.innerHtml = stock.unit;
        tr.appendChild(td.cloneNode(true));
        td.innerHtml = stock.tax;
        tr.appendChild(td.cloneNode(true));
        
        var actionButton = document.createElement('button');
        actionButton.innerHTML = "Update";
        actionButton.id = stock._id;
        actionButton.className = "btn btn-primary btn-update";
        actionButton.setAttribute('data-rev', stock._rev);
        console.log(stock);
        tr.appendChild(actionButton);
        
        // console.log(tr);
        return tr;
    }


    

    stockRead();

    function addUpdateClickListener(){
        var btnUpdate = document.getElementsByClassName('btn-update');

        for(let i = 0; i < btnUpdate.length; i++){
            btnUpdate[i].addEventListener('click', (event) =>{
                console.log(btnUpdate[i]);
                populateUpdateForm();
            });
        }
    }

    function populateUpdateForm(){
        db.get()
    }
    
})();