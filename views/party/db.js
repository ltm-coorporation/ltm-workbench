// (function(){
    // "use strict"

    // window.addEventListener("load", function(){

        var db = new PouchDB('ltm');
        var remote = false;

        
        
        var btnSave = document.getElementById('btnSave');

        btnSave.addEventListener('click', (event) => {
            if(!btnSave.getAttribute("data-rev")) return partyCreate();

            return partyUpdate();
        });

        function partyCreate(){
            var party = buildPartyObject();
            
           

            db.put(party, function(err, result){
                if(err) return err;

                if(partyRead()){
                    return clearForm();
                };
                
                return new Error("party not created");
            });
        }

        function partyUpdate(){
            var party = buildPartyObject();


            db.put(party, function(err, doc){
                if(err) return console.log(err);

                if(!partyRead()) return new Error("Party Read");
                if(!clearForm()) return new Error("Form clear error");
                return toggleSaveButton("save", doc);                
            });
        }

        function partyRead(){
            db.allDocs({
                include_docs: true,
                descending: true
            }, function(err, doc){
                if(err) return console.log(err);
                return redrawTable(doc.rows);
            });
        }

        function partyDelete(docID){
            db.get(docID, function(err, doc){
                if(err) return console.log(err);

                db.remove(doc, function(err, response){
                    if(err) return console.log(err);
                    return partyRead();
                });
            });
        }

        function redrawTable(partyRows){
            var tbody = document.getElementById('tableBody');
            tbody.innerHTML = "";

            partyRows.forEach(partyRow => {
                tbody.appendChild(createPartyRow(partyRow.doc));
            });

            return addActionClickListener();            
        }

        function createPartyRow(party){

            var tr = document.createElement('tr');
            var td = document.createElement('td');

            td.innerHTML = party.name;
            tr.appendChild(td.cloneNode(true));
            td.innerHTML = party.phone;
            tr.appendChild(td.cloneNode(true));
            td.innerHTML = party.whatsapp;
            tr.appendChild(td.cloneNode(true));
            td.innerHTML = party.city;
            tr.appendChild(td.cloneNode(true));
            td.innerHTML = party.district;
            tr.appendChild(td.cloneNode(true));
            td.innerHTML = party.state;
            tr.appendChild(td.cloneNode(true));

            td.innerHTML = "";
            var actionButton = document.createElement('button');
            actionButton.setAttribute('data-id', party._id);

            actionButton.innerHTML = "Update";
            actionButton.className = " btn btn-primary btn-update";
            
            td.appendChild(actionButton.cloneNode(true));
            
            actionButton.innerHTML = "Delete";
            actionButton.className = "btn btn-primary btn-delete";
            
            td.appendChild(actionButton.cloneNode(true));

            tr.appendChild(td);

            return tr;            
        }

        partyRead();

        function addActionClickListener(){
            var btnUpdate = document.getElementsByClassName('btn-update');

            for(let i =0; i < btnUpdate.length; i++){
                btnUpdate[i].addEventListener('click', (event) => {
                    populateUpdateForm(btnUpdate[i]);
                });
            }

            var btnDelete = document.getElementsByClassName('btn-delete');

            for(let i =0; i < btnDelete.length; i++){
                btnDelete[i].addEventListener('click', (event) => {
                    partyDelete(btnDelete[i].getAttribute('data-id'));
                });
            }

            return true;
        }


        function buildPartyObject(){

            var party = {};
            
            party.name      = getProp('name');
            party.contact   = getProp('contact');
            party.phone     = getProp('phone');
            party.whatsapp  = getProp('whatsapp');
            party.email     = getProp('email');
            
            party.street_address = getProp('street_address');
            party.city           = getProp('city');
            party.district       = getProp('district');
            party.state          = getProp('state');
            party.pincode        = getProp('pincode');

            party._id   = new Date().toISOString();

            var _rev = document.getElementById('btnSave').getAttribute('data-rev');
            
            if(_rev){
                party._rev = _rev;
                party._id = document.getElementById('btnSave').getAttribute('data-id');
            }

            return party;
        }

        function getProp(prop){
            return document.getElementById('customer['+prop+']').value;
        }

        
        function populateUpdateForm(element){
            clearForm();

            db.get(element.getAttribute('data-id'), function(err, doc){
                if (err) return console.log(err);

                Object.keys(doc).forEach(function(key){
                    var feild = document.getElementById('customer['+key+']');
                    
                    if(feild) feild.value = doc[key];
                });

                return toggleSaveButton("update", doc);
            });
        }

        function clearForm(){
            var inputFields = document.getElementsByTagName('input');
            for(let i =0; i < inputFields.length; i++){
                inputFields[i].value = "";
            }

            document.getElementById('btnSave').removeAttribute('data-id');
            document.getElementById('btnSave').removeAttribute('data-rev');
            
            return true;
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
// })();