
var Message = {

    parse : function(j){

        if(!Array.isArray(j)) return;

        for(var i in j){
            if(j[i].type == 'NOTIFY') Message.showNotify(j[i]);
            else if(j[i].type == 'POPUP') Message.showPopup(j[i]);
            else if(j[i].type == 'FIELD') Message.showField(j[i]);
        }
    },

    showNotify: function(e){

        if(typeof e.text == 'undefined' ) return;
        var UID = new Date().getTime();

        var msgObj = document.createElement('div');
        msgObj.className = 'alert';
        msgObj.id =  'MSG_'+UID;

        if(e.level==0)      msgObj.addClass('alert-error');
        else if(e.level==1) msgObj.addClass('alert-warn');
        else if(e.level==2) msgObj.addClass('alert-success');
        else if(e.level==3) msgObj.addClass('alert-info');
        else if(e.level==4) msgObj.addClass('');

        var a = document.createElement('a');
        a.addClass('close');
        a.innerText = 'X';
        a.addEventListener('click', function(){
            this.closest('.alert').remove();
        });
        msgObj.appendChild(a);
        
        if(typeof e.title=='string'){
            var title = document.createElement('h3');
            title.innerText = e.title;
            msgObj.appendChild(title);
        }

        if(typeof e.text=='string'){
            var text = document.createElement('p');
            text.innerHTML = e.text;
            msgObj.appendChild(text);
        }

        if( Array.isArray(e.buttons) && e.buttons.length>0){
            var btnsCont = document.createElement('div');
            btnsCont.addClass('btnsContainer');
            for(var i in e.buttons){
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'btn';
                b.addClass(e.buttons[i].className);
                b.dataset.btnAction = e.buttons[i].action;
                b.innerText = e.buttons[i].text;
                b.addEventListener('click', function(){
                    eval(this.dataset.btnAction);
                });
                btnsCont.appendChild(b);
            }
            msgObj.appendChild(btnsCont);
        }

        var m = document.getElementById('Poppins-Notify-Container');
        if(m == null){
            m = document.createElement("div");
            m.id = 'Poppins-Notify-Container';
            m.className = 'poppinsNotifyContainer';
            document.body.appendChild(m);
        }
        m.appendChild(msgObj);
    },

    showPopup: function(e){

        if(typeof e.text == 'undefined' ) return;
        var UID = new Date().getTime();

        var msgObj = document.createElement('div');
        msgObj.className = 'dialog';
        msgObj.id =  'MSG_'+UID;

        if(e.level==0)      msgObj.addClass('dialog-error');
        else if(e.level==1) msgObj.addClass('dialog-warn');
        else if(e.level==2) msgObj.addClass('dialog-success');
        else if(e.level==3) msgObj.addClass('dialog-info');
        else if(e.level==4) msgObj.addClass('');
        
        if(typeof e.title=='string'){
            var title = document.createElement('div');
            title.addClass('dialog-head');
            title.innerHTML = '<h3>'+e.title+'</h3>';
            msgObj.appendChild(title);
        }

        if(typeof e.text=='string'){
            var text = document.createElement('div');
            text.addClass('dialog-body');
            text.innerHTML = e.text;
            msgObj.appendChild(text);
        }

        if( Array.isArray(e.buttons) && e.buttons.length>0){
            var btnsCont = document.createElement('div');
            btnsCont.addClass('dialog-foot');
            for(var i in e.buttons){
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'btn';
                b.addClass(e.buttons[i].className);
                b.dataset.btnAction = e.buttons[i].action;
                b.innerText = e.buttons[i].text;
                b.addEventListener('click', function(){
                    eval(this.dataset.btnAction);
                });
                btnsCont.appendChild(b);
            }
            msgObj.appendChild(btnsCont);
        }

        document.body.appendChild(msgObj);

        Dialog.open('MSG_'+UID);

    },

    showField: function(d){

    }

};


var Dialog = {

    showMask: function(){
        var m = document.getElementById('Poppins-MASK');
        if(m == null){
            m = document.createElement("div");
            m.id = 'Poppins-MASK';
            m.className = 'poppinsMask';
            document.body.appendChild(m);
        }
        m.addClass('active');
    },

    hideMask: function(){
        document.getElementById('Poppins-MASK').removeClass('active');
    },

    open: function(id, opt){

        if(opt == null) opt = {};
        var set = {
            draggable: typeof opt.draggable == 'undefined' ? true : opt.draggable,
            btnClose: typeof opt.btnClose == 'undefined' ? true : opt.btnClose,
            open: typeof opt.open == 'undefined' ? function(){} : opt.open,
            close: typeof opt.close == 'undefined' ? function(){} : opt.close,
            number: 0
        };

        var d = id;
        if(typeof d == 'string')
            d = document.getElementById(id);

        if( d.length==0 ) return;

        Dialog.showMask();

        d.dialog = set;

        if( d.querySelector('a.close')==null && set.btnClose ){
            var a = document.createElement('a');
            a.className = 'close';
            a.innerText = 'X';
            a.addEventListener('click', Dialog.close);
            d.insertBefore(a, d.firstChild);
        }

        if(typeof set.open == 'function'){
            set.open(d);
        }else if(typeof set.open == 'string'){
			Pop.getDataByString(set.open)(d);
        }

        var openedDialog = document.querySelectorAll('.dialog.open');
        if( openedDialog.length>0 ){
            openedDialog.forEach(function(e){
                e.style.zIndex = 99999;
                e.removeClass('first');
                e.dialog.number++;
            });
        }
        
        d.addClass('open');
        d.addClass('first');
        
    },

    close: function(){
		
        var o = document.querySelector('.dialog.open.first');
        if( o == null || o.length == 0 ) return;

        o.removeClass('open');
        o.removeClass('first');
        var set = o.dialog;

        if(typeof set.close == 'function'){
            set.close(o);
        }else if(typeof set.close == 'string'){
			Pop.getDataByString(set.close)(o);
        }

        var openedDialog = document.querySelectorAll('.dialog.open');
        if(openedDialog.length==0){
            Dialog.hideMask();
            return;
        }

        openedDialog.forEach(function(e){
            e.dialog.number--;
            if(e.dialog.number == 0){
                e.addClass('first');
                e.style.zIndex = 100001;
            }
        });
    },

    alert: function(txt, title){
        
        var dialog = document.createElement('div');
        dialog.className = 'dialog dialog-info';
        dialog.id = 'DialogAlert' + new Date().getTime();

        var html = '<div class=" dialog-head"><h3>'+( title ? title : 'Info' )+'</h3></div>';
        html += '<div class="dialog-body">'+txt+'</div>';
        html += '<div class="dialog-foot">';
        html += '<button type="button" class="btn active" onclick="Dialog.close();this.closest(\'.dialog\').remove();">Close</button>';
        html += '</div>';

        dialog.innerHTML = html;

        document.body.appendChild(dialog);
        Dialog.open(dialog);
    }

};