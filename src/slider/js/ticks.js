/*
Copyright (c) 2010, Motty Katan All rights reserved.
TickSlider
version: 1
*/
 
// Define a new extension class to calculate values differently
function TickSlider() {
    TickSlider.superclass.constructor.apply( this, arguments );
}

// Combine SliderBase with the new extension class any others to
// create a new Slider
Y.TickSlider = Y.extend( TickSlider, Y.Slider, {
        
        initializer : function () {
            /**
             * The event for the binding/unbinding of the valueChange event. Do not write to
             * this property.
             *
             * @property evtValueChanged
             * @type {Object}
             */        
            this.evtValueChanged = null;        
        },           
                            
       /**
        * Create the Ticks structure for the Slider. using SliderBase method  
        * originaly a stub method of Widget.       
        * @method renderUI
        * @protected
        */
        renderUI: function () {
            // Ways to avoid extending and using build&mix instead would require:
            // 1. Changes in Widget: moving parsePng to after("render") or by calling parsePng
            //    another time.
            // 2. Overwriting renderRail function (and css changes to make the ticks visible and)
            //    in the correct place.   
            Y.TickSlider.superclass.renderUI.call(this, arguments);                                  
            var length = parseInt(this.get('length'), 10),
                thumbMid = parseInt(this.thumb.getStyle( this._key.dim ), 10) / 2,
                nFactor = (thumbMid / length * 100),                
                nTicks =  this.get('ticks'),
                sBackgroundPosition = (this._key.xyIndex) ? "0% ":"",
                nPos, 
                i,
                oTick,
                before,
                oSlide = Y.Node.getDOMNode(this.get('contentBox'));
            for(i = 0; i < nTicks; i++) {
                oTick = Y.DOM.create(
                            Y.substitute( this.TICK_TEMPLATE, {
                                tickId      : "tick" + i,
                                tickClass: this.getClassName( 'tick', this.axis)
                         } ) );
                Y.DOM.setStyle(oTick, this._key.dim, this.get( 'length' ));
                
                //position from max=100%   
                nPos  = i * 100 / (nTicks - 1);
                nPos += (nFactor - i * nFactor * 2   / ( nTicks - 1));
                
                Y.DOM.setStyle(oTick, "backgroundPosition", sBackgroundPosition + nPos + "%");                                                            
                Y.DOM.setStyle(oTick, "backgroundRepeat", "no-repeat");                
                before = Y.DOM.elementByAxis(oSlide, "firstChild");
                Y.DOM.addHTML( Y.DOM.elementByAxis(oSlide, "firstChild" ), oTick, "before");  
                Y.DOM.addHTML(oTick, before);                                
                
                oSlide = oTick; 
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
            this.evtValueChanged = this.after("valueChange", this._afterValueChange);
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
            var nTicks = (this.get('ticks') - 1),
                tick = {},
                calcMax = this.get('max') - this.get('min');
            tick.tick   = Math.round(value / calcMax * nTicks);
            tick.newVal = tick.tick * calcMax / nTicks;
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
            return Y.Lang.isNumber(value) && value > 1 && value < parseInt(this.get( 'length' ), 10 ) / 2 ;                
        },
        
        /**
         * Tick template 
         * {placeholder}s are used for template substitution at render time.
         *
         * @property TICK_TEMPLATE
         * @type {String}
         * @default &lt;span id="{tickId}" class="{tickClass}">&lt;/span>
         */
        TICK_TEMPLATE     : '<span id="{tickId}" class="{tickClass}">' +
                            '</span>'               
}, {
    // Y.TickSlider static properties

    /**
     * The identity of the widget.
     *
     * @property SliderBase.NAME
     * @type String
     * @default 'sliderBase'
     * @readOnly
     * @protected
     * @static
     */
    NAME : 'slider',

    /**
     * Static property used to define the default attribute configuration of
     * the Widget.
     *
     * @property SliderBase.ATTRS
     * @type {Object}
     * @protected
     * @static
     */
    ATTRS : {

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
    } 
});
