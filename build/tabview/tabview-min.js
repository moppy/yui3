YUI.add("tabview",function(F){var A=F.TabviewBase._queries,E=F.TabviewBase._classNames,G=".",B=F.ClassNameManager.getClassName,C=F.Base.create("tabView",F.Widget,[F.WidgetParent],{_afterChildAdded:function(H){this.get("contentBox").focusManager.refresh();},_defListNodeValueFn:function(){return F.Node.create(C.LIST_TEMPLATE);},_defPanelNodeValueFn:function(){return F.Node.create(C.PANEL_TEMPLATE);},_afterChildRemoved:function(J){var H=J.index,I=this.get("selection");if(!I){I=this.item(H-1)||this.item(0);if(I){I.set("selected",1);}}this.get("contentBox").focusManager.refresh();},_initAria:function(){var H=this.get("contentBox"),I=H.one(A.tabviewList);if(I){I.setAttrs({role:I});}},bindUI:function(){this.get("contentBox").plug(F.Plugin.NodeFocusManager,{descendants:G+E.tabLabel,keys:{next:"down:39",previous:"down:37"},circular:true});this.after("render",this._setDefSelection);this.after("addChild",this._afterChildAdded);this.after("removeChild",this._afterChildRemoved);},renderUI:function(){var H=this.get("contentBox");this._renderListBox(H);this._renderPanelBox(H);this._childrenContainer=this.get("listNode");this._renderTabs(H);},_setDefSelection:function(H){var I=this.get("selection")||this.item(0);this.some(function(J){if(J.get("selected")){I=J;return true;}});if(I){this.set("selection",I);I.set("selected",1);}},_renderListBox:function(H){var I=this.get("listNode");if(!I.inDoc()){H.append(I);}},_renderPanelBox:function(H){var I=this.get("panelNode");if(!I.inDoc()){H.append(I);}},_renderTabs:function(H){var K=H.all(A.tab),I=this.get("panelNode"),J=(I)?this.get("panelNode").get("children"):null,L=this;if(K){K.addClass(E.tab);H.all(A.tabLabel).addClass(E.tabLabel);H.all(A.tabPanel).addClass(E.tabPanel);K.each(function(O,N){var M=(J)?J.item(N):null;L.add({boundingBox:O,contentBox:O.one(G+E.tabLabel),label:O.one(G+E.tabLabel).get("text"),panelNode:M});});}}},{LIST_TEMPLATE:'<ul class="'+E.tabviewList+'"></ul>',PANEL_TEMPLATE:'<div class="'+E.tabviewPanel+'"></div>',ATTRS:{defaultChildType:{value:"Tab"},listNode:{setter:function(H){H=F.one(H);if(H){H.addClass(E.tabviewList);}return H;},valueFn:"_defListNodeValueFn"},panelNode:{setter:function(H){H=F.one(H);if(H){H.addClass(E.tabviewPanel);}return H;},valueFn:"_defPanelNodeValueFn"},tabIndex:{value:null}},HTML_PARSER:{listNode:A.tabviewList,panelNode:A.tabviewPanel}});F.TabView=C;var D=F.Lang,A=F.TabviewBase._queries,E=F.TabviewBase._classNames,B=F.ClassNameManager.getClassName;F.Tab=F.Base.create("tab",F.Widget,[F.WidgetChild],{BOUNDING_TEMPLATE:'<li class="'+E.tab+'"></li>',CONTENT_TEMPLATE:'<a class="'+E.tabLabel+'"></a>',PANEL_TEMPLATE:'<div class="'+E.tabPanel+'"></div>',_uiSetSelectedPanel:function(H){this.get("panelNode").toggleClass(E.selectedPanel,H);},_afterTabSelectedChange:function(H){this._uiSetSelectedPanel(H.newVal);},_afterParentChange:function(H){if(!H.newVal){this._remove();}else{this._add();}},_initAria:function(){var I=this.get("contentBox"),J=I.get("id"),H=this.get("panelNode");if(!J){J=F.guid();I.set("id",J);}I.set("role","tab");I.get("parentNode").set("role","presentation");H.setAttrs({role:"tabpanel","aria-labelledby":J});},syncUI:function(){this.set("label",this.get("label"));this.set("content",this.get("content"));this._uiSetSelectedPanel(this.get("selected"));},bindUI:function(){this.after("selectedChange",this._afterTabSelectedChange);this.after("parentChange",this._afterParentChange);},renderUI:function(){this._renderPanel();this._initAria();},_renderPanel:function(){this.get("parent").get("panelNode").appendChild(this.get("panelNode"));},_add:function(){var I=this.get("parent").get("contentBox"),J=I.get("listNode"),H=I.get("panelNode");if(J){J.appendChild(this.get("boundingBox"));}if(H){H.appendChild(this.get("panelNode"));}},_remove:function(){this.get("boundingBox").remove();this.get("panelNode").remove();},_onActivate:function(H){if(H.target===this){H.domEvent.preventDefault();H.target.set("selected",1);}},initializer:function(){this.publish(this.get("triggerEvent"),{defaultFn:this._onActivate});},_defLabelSetter:function(H){this.get("contentBox").setContent(H);return H;},_defContentSetter:function(H){this.get("panelNode").setContent(H);return H;},_defPanelNodeValueFn:function(){var L,I=this.get("contentBox").get("href")||"",K=this.get("parent"),J=I.indexOf("#"),H;I=I.substr(J);if(I.charAt(0)==="#"){L=I.substr(1);H=F.one(I).addClass(E.tabPanel);}else{L=F.guid();}if(K){H=H||K.get("panelNode").get("children").item(this.get("index"));}if(!H){H=F.Node.create(this.PANEL_TEMPLATE);H.set("id",L);}return H;}},{ATTRS:{triggerEvent:{value:"click"},label:{setter:"_defLabelSetter",validator:D.isString},content:{setter:"_defContentSetter",validator:D.isString},panelNode:{setter:function(H){H=F.one(H);if(H){H.addClass(E.tabPanel);}return H;},valueFn:"_defPanelNodeValueFn"},tabIndex:{value:null,validator:"_validTabIndex"}},HTML_PARSER:{selected:function(H){return this.get("boundingBox").hasClass(E.selectedTab);}}});},"@VERSION@",{requires:["substitute","node-focusmanager","tabview-base","widget","widget-parent","widget-child"]});