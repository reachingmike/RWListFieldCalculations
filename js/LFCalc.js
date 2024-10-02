gform.addAction( 'gform_post_calculation_events', function( mergeTagArr, formulaField, formId, calcObj ){
    var fieldId = parseInt( mergeTagArr[1] ),
        fieldSelector = '#field_' + formId + '_' + fieldId;

    if ( jQuery( fieldSelector + ' table.gfield_list' ).length == 1 ) {
        jQuery( fieldSelector )
            .on( 'click', '.add_list_item', function () {
                jQuery( fieldSelector + ' .delete_list_item' ).removeProp( 'onclick' );
                calcObj.bindCalcEvent( fieldId, formulaField, formId, 0 );
            })
            .on( 'click', '.delete_list_item', function () {
                gformDeleteListItem( this, 0 );
                calcObj.bindCalcEvent( fieldId, formulaField, formId, 0 );
            });

        if ( mergeTagArr[2] != null ) {
            var columnNo = mergeTagArr[2].substr( 1 ),
                columnSelector = '.gfield_list_' + fieldId + '_cell' + columnNo + ' :input';
            jQuery( fieldSelector ).on( 'keyup', columnSelector, function () {
                calcObj.bindCalcEvent( fieldId, formulaField, formId, 0 );
            });
        }
    }
});

gform.addFilter( 'gform_merge_tag_value_pre_calculation', function( value, mergeTagArr, isVisible, formulaField, formId ){
    var fieldId = parseInt( mergeTagArr[1] ),
        fieldSelector = '#field_' + formId + '_' + fieldId;
    
    // check if merge tag belongs to a List field and that it isn't hidden by conditional logic
    if ( jQuery( fieldSelector + ' table.gfield_list' ).length == 1 && isVisible ) {

        if ( mergeTagArr[2] == null ) {
            // if no column specified count the rows
            value = jQuery( fieldSelector + ' table.gfield_list tbody tr.gfield_list_group' ).length;
        } else {
            var columnNo = mergeTagArr[2].substr( 1 ),
                columnSelector = '.gfield_list_' + fieldId + '_cell' + columnNo + ' :input',
                cellValue = 0;

            value = 0;
                
            // if column specified get the input values from each row and calculate the sum
            jQuery( columnSelector ).each( function () {
                let rawValue = jQuery( this ).val().trim();  // Trim spaces
                let cellValue = parseFloat(rawValue);  // Convert to number
            
                if ( isNaN(cellValue) ) {
                    console.log("Skipping invalid or empty value:", rawValue);
                    return;
                }
            
                console.log("Original Value:", rawValue, "Converted Numeric Value:", cellValue);
            
                // Force numeric addition using Number()
                value = Number(value) + Number(cellValue); 
                console.log("Current Sum:", value);  // Log the cumulative sum after each iteration
            });
        }

    }

    return value;
});
