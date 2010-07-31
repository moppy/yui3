/*
Copyright (c) 2010, Motty Katan All rights reserved.
TickSlider
version: 1
*/

YUI().add("slider-ticks", function ( Y ) {
 
    // Define a new extension class to calculate values differently
    function TickSlider() {    
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
            sThumbUrl = this.get( 'thumbUrl' );
            sThumbUrl = sThumbUrl.replace(/[^\/]*\..{3,4}$/, "tick.png" );
            
                oSlide = Y.Node.getDOMNode( e.parentNode );
                nTicks =  parseInt( this.get( 'ticks' ) );                     
                for(i = 0; i < nTicks; i++) {                
                    oTick = Y.DOM.create( "<div id='tick" + i + "'></div>" );            
                    Y.DOM.addClass( oTick, "tick" );       
                    Y.DOM.setStyle( oTick, "width", this.get( 'length' ) );
                    nPos  = i * 100 / ( nTicks - 1 );                        
                    nPos += ( 5 - i * 10 / ( nTicks - 1) );
                    Y.DOM.setStyle( oTick, "backgroundPosition", nPos + "%" );                    
                    Y.DOM.setStyle( oTick, "backgroundRepeat", "no-repeat" );
                    Y.DOM.setStyle( oTick, "backgroundImage", "url(" + sThumbUrl + ")" );      
                    Y.DOM.addHTML( Y.DOM.elementByAxis( oSlide, "parentNode" ), oTick );   
                    Y.DOM.addHTML( oTick, oSlide );
                    //each time insert to the parent of the previous tick
                    oSlide = oTick;
                }                
                this.after( "valueChange", this._onValueChangedSetToNearestTick);                   
            },
            
            _onValueChangedSetToNearestTick: function( e )
            {
                nTicks = (parseInt(this.get( 'ticks' )))-1;
                this.setValue(Math.round(e.newVal/100*nTicks)*100/nTicks);                
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
                return parseInt( value )>1 && value < parseInt( this.get( 'length' ) ) / 2 ;
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
    
    
     
}, '3.1.1' ,{requires:['slider-base','clickable-rail', 'slider-value-range']});
