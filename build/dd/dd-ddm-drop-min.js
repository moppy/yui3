YUI.add("dd-ddm-drop",function(A){A.mix(A.DD.DDM,{_noShim:false,_activeShims:[],_hasActiveShim:function(){if(this._noShim){return true;}return this._activeShims.length;},_addActiveShim:function(B){this._activeShims[this._activeShims.length]=B;},_removeActiveShim:function(C){var B=[];A.each(this._activeShims,function(E,D){if(E._yuid!==C._yuid){B[B.length]=E;}});this._activeShims=B;},syncActiveShims:function(B){A.later(0,this,function(C){var D=((C)?this.targets:this._lookup());A.each(D,function(F,E){F.sizeShim.call(F);},this);},B);},mode:0,POINT:0,INTERSECT:1,STRICT:2,useHash:true,activeDrop:null,validDrops:[],otherDrops:{},targets:[],_addValid:function(B){this.validDrops[this.validDrops.length]=B;return this;},_removeValid:function(B){var C=[];A.each(this.validDrops,function(E,D){if(E!==B){C[C.length]=E;}});this.validDrops=C;return this;},isOverTarget:function(C){if(this.activeDrag&&C){var G=this.activeDrag.mouseXY,F,B=this.activeDrag.get("dragMode"),E,D=C.shim;if(G&&this.activeDrag){E=this.activeDrag.region;if(B==this.STRICT){return this.activeDrag.get("dragNode").inRegion(C.region,true,E);}else{if(C&&C.shim){if((B==this.INTERSECT)&&this._noShim){F=((E)?E:this.activeDrag.get("node"));return C.get("node").intersect(F,C.region).inRegion;}else{if(this._noShim){D=C.get("node");}return D.intersect({top:G[1],bottom:G[1],left:G[0],right:G[0]},C.region).inRegion;}}else{return false;}}}else{return false;}}else{return false;}},clearCache:function(){this.validDrops=[];this.otherDrops={};this._activeShims=[];},_activateTargets:function(){this._noShim=true;this.clearCache();A.each(this.targets,function(C,B){C._activateShim([]);if(C.get("noShim")==true){this._noShim=false;}},this);this._handleTargetOver();},getBestMatch:function(F,D){var C=null,E=0,B;A.each(F,function(I,H){var G=this.activeDrag.get("dragNode").intersect(I.get("node"));I.region.area=G.area;if(G.inRegion){if(G.area>E){E=G.area;C=I;}}},this);if(D){B=[];A.each(F,function(H,G){if(H!==C){B[B.length]=H;}},this);return[C,B];}else{return C;}},_deactivateTargets:function(){var B=[],C,E=this.activeDrag,D=this.activeDrop;if(E&&D&&this.otherDrops[D]){if(!E.get("dragMode")){B=this.otherDrops;delete B[D];}else{C=this.getBestMatch(this.otherDrops,true);D=C[0];B=C[1];}E.get("node").removeClass(this.CSS_PREFIX+"-drag-over");if(D){D.fire("drop:hit",{drag:E,drop:D,others:B});E.fire("drag:drophit",{drag:E,drop:D,others:B});}}else{if(E&&E.get("dragging")){E.get("node").removeClass(this.CSS_PREFIX+"-drag-over");E.fire("drag:dropmiss",{pageX:E.lastXY[0],pageY:E.lastXY[1]});}else{}}this.activeDrop=null;A.each(this.targets,function(G,F){G._deactivateShim([]);},this);},_dropMove:function(){if(this._hasActiveShim()){this._handleTargetOver();}else{A.each(this.otherDrops,function(C,B){C._handleOut.apply(C,[]);});}},_lookup:function(){if(!this.useHash||this._noShim){return this.validDrops;}var B=[];A.each(this.validDrops,function(D,C){if(D.shim&&D.shim.inViewportRegion(false,D.region)){B[B.length]=D;}});return B;},_handleTargetOver:function(){var B=this._lookup();A.each(B,function(D,C){D._handleTargetOver.call(D);},this);},_regTarget:function(B){this.targets[this.targets.length]=B;},_unregTarget:function(C){var B=[],D;A.each(this.targets,function(F,E){if(F!=C){B[B.length]=F;}},this);this.targets=B;D=[];A.each(this.validDrops,function(F,E){if(F!==C){D[D.length]=F;}});this.validDrops=D;},getDrop:function(C){var B=false,D=A.one(C);if(D instanceof A.Node){A.each(this.targets,function(F,E){if(D.compareTo(F.get("node"))){B=F;}});}return B;}},true);},"@VERSION@",{requires:["dd-ddm"],skinnable:false});