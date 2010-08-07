/*
Copyright (c) 2010, Motty Katan All rights reserved.
TickSlider
version: 1
*/

YUI().add("slider-ticks", function ( Y ) {
 
    // Define a new extension class to calculate values differently
    function TickSlider() {
        //attribute for the binding/unbinding
        this.evtValueChanged = null;
        this.after( "render", this._onRenderAddTicks );
    }
    // Add attribute configuration and prototype to decorate the Slider
    Y.mix( TickSlider, {
 
        ATTRS: {
            /**
             * The value associated with the number of ticks on the rail.
             * Minimum two ticks, one at each end. 
             * @attribute ticks
             * @type { Number }
             * @default 2 
             */
            ticks: {
                value: 2,
                validator: '_validateTicks'
            } 
        },
        
        /* additional prototype members and methods */          
        prototype: { 
            _onRenderAddTicks: function( e ) 
            {
                //save this value for later calculations
                this._calcMax = this.get( 'max') - this.get( 'min');    
                var length    = parseInt(this.get( 'length' ));
                var thumbMid = parseInt(this.thumb.getStyle( this._key.dim )) / 2;
                var nFactor = ( thumbMid / length * 100 );
                                                 
                var oSlide = oSlideParent = Y.Node.getDOMNode( e.parentNode );
                var nTicks =  parseInt( this.get( 'ticks' ) );
                var nPos, sId, imgLoader, sTickUrl, parsePng;
                var sBackgroundPosition = (this._key.xyIndex) ? "0% ":"";                                                      
                for(i = 0; i < nTicks; i++) {
                    sId = "tick" + i;
                    oTick = Y.DOM.create( "<div id='tick" + i + "' class='yui3-slider-tick-" + this.axis + "'></div>" );                   
                    Y.DOM.addClass( oTick, "tick" );
                    Y.DOM.setStyle( oTick, this._key.dim, this.get( 'length' ) );
                    
                    //position from max=100%   
                    nPos  = i * 100 / ( nTicks - 1 );
                    nPos += ( nFactor - i * nFactor * 2   / ( nTicks - 1) );                   
                    Y.DOM.setStyle( oTick, "backgroundPosition", sBackgroundPosition + nPos + "%" );                                        
                    Y.DOM.setStyle( oTick, "backgroundRepeat", "no-repeat" );
                    
                    Y.DOM.addHTML( Y.DOM.elementByAxis( oSlide, "parentNode" ), oTick );   
                    Y.DOM.addHTML( oTick, oSlide );
                    
                    //each time insert to the parent of the previous tick
                    oSlide = oTick;
                }

                //png support: if the tick image is png, assume the rest may be as well
                sTickUrl = Y.DOM.getStyle(oTick, "backgroundImage");
                //use imageLoader to test for png parsing
                imgLoader = new Y.ImgLoadImgObj ({domId: sId, bgUrl: sTickUrl, isPng: true});
                parsePng = imgLoader.get( "isPng" );
                if (parsePng)
                { 
                    //parse all images inside the tick meaning the slider
                    nodeList = Y.Selector.query("*", oTick, false, true);
                    //add the current tick itself
                    nodeList[nodeList.length] = oTick;
                    this._pngParse( nodeList );
                }
            },
            
           /**
            * Override of stub method in SliderBase that is called at the end of
            * its bindUI stage of render().  Subscribes to internal events to
            * trigger UI and related state updates.
            *
            * @method _bindValueLogic
            * @protected             
            */
            _bindValueLogic: function () {
                this.evtValueChanged = this.after( "valueChange", this._afterValueChange );
            },
           
           /**
            * Unbinding the valueChange logic. In combine with the _bindValueLogic() 
            * can fix 
            * trigger UI and related state updates.
            *
            * @method _unBindValueLogic
            * @protected             
            */
            _unBindValueLogic: function () {
                this.evtValueChanged.detach();
            },
            
           /**
            * Returns the nearest tick value to the current value input.  
            *
            * @method _nearestTick
            * @param value { mixed } Value to compute nearest tick
            * @return { Number } tick's calculated value 
            * @protected
            */            
            _nearestTick: function ( value ) {
                var nTicks = (this.get( 'ticks' ) - 1);                                  
                var tick = {};
                tick.tick   = Math.round(value / this._calcMax * nTicks);
                tick.newVal = tick.tick * this._calcMax / nTicks;               
                return tick;
            },
            
            /**
             * Adjust the thumb to the nearest tick 
             *
             * @method _afterValueChange
             * @param e { EventFacade } The <code>valueChange</code> event.
             * @protected
             */            
            _afterValueChange: function(e)
            {       
                //operate nicely inside a sandbox        
                this._unBindValueLogic();
                tick = this._nearestTick(e.newVal);
                this._setPosition(tick.newVal);                  
                this.fire( 'tickChange', tick ); 
                this._bindValueLogic();                
            },

           /**
            * Parse nodes that may have png images and support 
            * png for browsers which have problem with png transparency
            *           
            * @param {Array} array of {HTMLElement}              
            * @method _pngParse
            * @protected             
            */
            _pngParse: function(nodeList)
            {
                var imgUrl, isPng, imgLoader;
                for(var i = 0; i < nodeList.length; i++){
                    imgUrl = Y.DOM.getStyle(nodeList[i], "backgroundImage");
                    isPng = /\.png\)?$/.test(imgUrl);
                    //exploiting imgLoader for pngStyling                                        
                    imgLoader = new Y.ImgLoadImgObj ({bgUrl: imgUrl, isPng: isPng});
                    node = Y.one(nodeList[i]);
                    if (isPng)
                    {
                        Y.DOM.setStyle(node, "backgroundImage", "none");
                        imgLoader.addPngStyle(node);
                    }
                }
            },

            /**
             * Validates new values assigned to <code>ticks</code> attribute.  Numbers
             * are acceptable greater than one and less than a half of length.
             * Override this to enforce different rules.
             *
             * @method _validateTicks
             * @param value { mixed } Value assigned to <code>ticks</code> attribute.
             * @return { Boolean } True for valid number.  False otherwise.
             * @protected
             */            
            _validateTicks: function ( value ) {
                return Y.Lang.isNumber( value ) && value > 1 && value < parseInt( this.get( 'length' ) ) / 2 ;                
            }
        }
    }, true);
 
 
    // Combine SliderBase with the new extension class any others to
    // create a new Slider
    Y.TickSlider = Y.Base.build( "slider", Y.SliderBase, [
        Y.ClickableRail,  // Should also support rail clicks
        Y.SliderValueRange,        
        TickSlider      // Use the new value methods and attributes
    ] );
    
    
     
}, '3.1.1' ,{requires:['slider-base','clickable-rail', 'slider-value-range', 'imageloader']});
