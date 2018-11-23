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

            
            
            
            // return new Error(" party not created ");
            var party = buildPartyObject();

            party._id = new Date().toISOString();

            db.put(party, function(err, result){
                if(err) return err;

                if(partyRead()){
                    if(clearform()) return true;
                };
                
                return new Error("party not created");
            });
        }

        function partyUpdate(){}
        function partyRead(){
            db.allDocs({
                include_docs: true,
                descending: true
            }, function(err, doc){
                if(err) return console.log(err);

                if(redrawTable(doc.rows)) return true;
                
                return false;
            });
        }

        function partyDelete(docID){
            db.get(docID, function(err, doc){
                if(err) return console.log(err);

                db.remove(doc, function(err, response){
                    if(err) return console.log(err);
                    if(stockRead()) return true;
                    return false;
                });
            });
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

            return party;
        }

        function getProp(prop){
            return document.getElementById('stock['+prop+']').value;
        }
// })();