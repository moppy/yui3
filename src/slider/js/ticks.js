/*
Copyright (c) 2010, Motty Katan All rights reserved.
TickSlider
version: 1
*/
 
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
    
        /**
         * Tick template 
         * {placeholder}s are used for template substitution at render time.
         *
         * @property TICK_TEMPLATE
         * @type {String}
         * @default &lt;span id="{tickId}" class="{tickClass}">&lt;/span>
         */
        TICK_TEMPLATE     : '<span id="{tickId}" class="{tickClass}">' +
                            '</span>',
                                 
        _onRenderAddTicks: function( e ) {
            //save this value for later calculations
            this._calcMax = this.get( 'max') - this.get( 'min');    
            var length = parseInt(this.get( 'length' ), 10),
                thumbMid = parseInt(this.thumb.getStyle( this._key.dim ), 10) / 2,
                nFactor = ( thumbMid / length * 100 ),                
                //TODO: YUI design problem! why pass e.parentNode if already accessible
                //using extending? 
                oSlide = Y.Node.getDOMNode( this._parentNode ),
                //save it for later use since oSlide is going to be overwritten
                //inside the loop
                oSlideParent = oSlide,
                nTicks =  this.get( 'ticks' ),
                sBackgroundPosition = (this._key.xyIndex) ? "0% ":"",
                tickClass = "yui3-slider-tick-" + this.axis,
                nPos, 
                i,
                oTick,
                before,
                nodeList;                
                                
            for(i = 0; i < nTicks; i++) {                
                oTick = Y.DOM.create(
                            Y.substitute( this.TICK_TEMPLATE, {
                                tickId      : "tick" + i,
                                tickClass: tickClass + " tick"
                         } ) );
                Y.DOM.setStyle( oTick, this._key.dim, this.get( 'length' ) );
                
                //position from max=100%   
                nPos  = i * 100 / ( nTicks - 1 );
                nPos += ( nFactor - i * nFactor * 2   / ( nTicks - 1) );                   
                Y.DOM.setStyle( oTick, "backgroundPosition", sBackgroundPosition + nPos + "%" );                                                            
                Y.DOM.setStyle( oTick, "backgroundRepeat", "no-repeat" );
                before = Y.DOM.elementByAxis( oSlide, "firstChild" );
                Y.DOM.addHTML( Y.DOM.elementByAxis( oSlide, "firstChild" ), oTick, "before");  
                Y.DOM.addHTML( oTick, before );
                
                //each time insert to the parent of the previous tick
                oSlide = oTick;
            }
            oSlide = null;

            //png support
            if ( this.isParsePng ) { 
                //parse all images inside the tick meaning the slider
                nodeList = Y.Selector.query("." + tickClass, oSlideParent, false, true);
                //add the current tick itself
                nodeList[nodeList.length] = oTick;
                this._pngParse( nodeList );
            }
            oSlideParent = oTick = null;
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
        * @return { Object } tick's serial id and calculated value for event info 
        * @protected
        */            
        _nearestTick: function ( value ) {
            var nTicks = (this.get( 'ticks' ) - 1),                                  
                tick = {};
            tick.tick   = Math.round(value / this._calcMax * nTicks);
            tick.newVal = tick.tick * this._calcMax / nTicks;
            return tick;
        },
        
        /**
         * Adjust the thumb to the nearest tick 
         * @event tickChange
         * @method _afterValueChange
         * @param e { EventFacade } The <code>valueChange</code> event.
         * @protected
         */            
        _afterValueChange: function(e) {       
            //operate nicely inside a sandbox        
            this._unBindValueLogic();
            var tick = this._nearestTick(e.newVal);
            this._setPosition(tick.newVal);
            Y.log("Current tick: " + tick.tick + ", Rail position: " + tick.newVal, "info", "slider");
            this.fire( 'tickChange', tick ); 
            this._bindValueLogic();                
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
            return Y.Lang.isNumber( value ) && value > 1 && value < parseInt( this.get( 'length' ), 10 ) / 2 ;                
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
    
    
     
