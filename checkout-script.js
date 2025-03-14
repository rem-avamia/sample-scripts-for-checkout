<script>
jQuery(document).ready(function($) {

        //add label to email as somehow it is not adding on server side
    let label = $('<label for="billing_email">Enter Your Email&nbsp;<abbr class="required" title="required">*</abbr></label>');
    $('#billing_email').attr('placeholder', 'Enter Your Email');

    $('.personal_info #billing_email_field').addClass('form-row-wide validate-required');

    // Append the label before the .woocommerce-input-wrapper inside #billing_email_field
    $('.personal_info #billing_email_field .woocommerce-input-wrapper').before(label);

    // Also ensure this works when the email field changes
    $('.personal_info #billing_email').on('input', function() {
        let emailValue = $(this).val();
        $('.woocommerce-billing-fields__customer-info-wrapper #billing_email').val(emailValue);
    });


    
        $('#billing_company').closest('.form-row').removeClass('form-row-full').addClass('form-row-first');
    //there is a weird bug on checkout page that is forcing the next container out, so we need to manually put it inside
    $('[data-id*="fc03340"]').detach().insertAfter('[data-id*="584c87b"]');
    
    function billing_fields(){
                $('#billing_city_field').addClass('form-row-last').removeClass('form-row-wide');
$('#billing_state_field').addClass('form-row-first').removeClass('form-row-wide');
    $('#billing_postcode_field').addClass('form-row-last').removeClass('form-row-wide');
$('#billing_address_1').attr('placeholder','Enter Full Address');
$('#billing_address_2').attr('placeholder','Enter Your Apartment Or Suite');
        console.log('added new classes to specific billing fields');
    }
    
    // Global Retrieve existing form data or initialize an empty object
    var formData = JSON.parse(sessionStorage.getItem('formData')) || {};

//get visible panel
    var visibleElement = $('.woocommerce-checkout > .thwmsc-tab-panel:visible');


    // Function to save the fields of the current step to sessionStorage
    function saveStepData(stepElement) {
        var stepId = $(stepElement).attr('id'); // Get the ID of the step (step1, step2, step3)
        // Retrieve existing form data or initialize an empty object
        // var formData = JSON.parse(sessionStorage.getItem('formData')) || {};

        // Loop through all input fields (inputs, selects, etc.) within the current step
        $(stepElement).find('input, select, textarea').each(function() {
            var fieldName = $(this).attr('name');
            var fieldValue = $(this).val();
            
            // Store each field's value in the formData object
            formData[fieldName] = fieldValue;
        });

        // Save the formData object to sessionStorage as a JSON string
        sessionStorage.setItem('formData', JSON.stringify(formData));
    }

    // Function to populate the form fields from sessionStorage
    function populateFields() {
        // Check if data exists in sessionStorage
        if (sessionStorage.getItem('formData')) {
            var formData = JSON.parse(sessionStorage.getItem('formData'));

            // Populate the form fields with the data from sessionStorage
            $.each(formData, function(fieldName, fieldValue) {
                $('[name="' + fieldName + '"]').val(fieldValue);
            });
        }
    }

    // Function to update the hash based on the visible step
    function updateHash() {
        // Find the currently visible child div inside .woocommerce-checkout
        var visibleElement = $('.woocommerce-checkout > .thwmsc-tab-panel:visible');

        if (visibleElement.length > 0) {
            // Get the classes of the visible element
            var classes = visibleElement.attr('class').split(/\s+/);

            // Find the second class (excluding .thwmsc-tab-panel)
            var secondClass = classes.find(function(className) {
                return className !== 'thwmsc-tab-panel';
            });

            // Update the hash with the second class
            if (secondClass) {
                window.location.hash = secondClass;
            }

      

            //set the current hash as session to be used lated
            sessionStorage.setItem('currentStep', window.location.hash.substring(1));

            // Save the data for this visible step
            saveStepData(visibleElement);
        }
    }

    // Initial hash update and populate fields when the page loads
    populateFields();  // Populate fields with saved data from sessionStorage
    // updateHash();  // Update the URL hash based on the currently visible step

    
     //change the hash when there is a hash in the url
       let get_step = sessionStorage.getItem('currentStep') || 'personal_info';

        //show the step aligned with the session step
     $('.thwmsc-tab-panel').hide();
  
     $(`.${get_step}`).attr('style','display:block!important').find('.thwmsc-tab-content').attr('style','display:block!important');
             window.location.hash = get_step;
                  console.log('current step:' +get_step);

     

           var visibleElement = $('.woocommerce-checkout > .thwmsc-tab-panel:visible');

           if (visibleElement.length) {
              //we jump to the multi step based on the current hash
            let get_step_number = visibleElement.attr('id').split('-').pop();
             //call the jump from multi step plugin function
            if (get_step_number > 0) {
                             thwmscJumpToStep(get_step_number);

            }
            console.log('step number'+ get_step_number);
           }
         

    // Retrieve the object from sessionStorage
    const storedData = JSON.parse(sessionStorage.getItem('formData'));
    let selectedData ="";
    if (storedData) {

    // Access the value of "selected_data"
    selectedData = storedData.selected_data;
    }

     //let's check if the pln step is visible
     var checkstepPlan = setInterval(function() {


     if (visibleElement.hasClass('plan') || visibleElement.hasClass('billing')) {

         // Check if the current step is not 'personal_info' and if selectedData exists
    if (sessionStorage.getItem('currentStep') !== 'personal_info' && selectedData) {

        // Click the element based on selectedData
        $('#variation-' + selectedData).find('.elementor-price-table__button').click();
        
        // Add the 'tier-selected' class to #action-next
        $('#action-next').addClass('tier-selected');

        // Log the selectedData to the console
        console.log(selectedData); // Outputs: 5975 or whatever the stored value is
    }


    //we force the jump to billing section when user selecte a plan
    $('#action-next.tier-selected').on('click',function(){
        if (!$(this).siblings().hasClass('prev-first')) {
                     thwmscJumpToStep(2);
        }

    });


}
clearInterval(checkstepPlan);
}, 500); // Delay of 2000ms (2 seconds)



    //hide buttons when the suer access order review
    if (get_step == 'order_review') {
        $('.thwmsc-buttons').hide();
        $('.thwmsc-tab .last').addClass('thwmsc-completed');
    }
     
    //we force to the plan section when clicked from the first step
/*    if (visibleElement.length) {
        let requiredField = visibleElement.find('.validate-required');
        let valueField = visibleElement.find('.validate-required input, .validate-required texarea, .validate-required select');
        if (requiredField.length > 0 && !requiredField.hasClass('woocommerce-invalid') && valueField.val()!== "") {
         thwmscJumpToStep(1);
    } 

    }*/


    // Periodically check for visibility changes and update hash and session storage
    setInterval(updateHash, 1500); // Check every 500ms (adjust as needed)



    $(document.body).on(
  "init_checkout payment_method_selected update_checkout updated_checkout checkout_error applied_coupon_in_checkout removed_coupon_in_checkout adding_to_cart added_to_cart removed_from_cart wc_cart_button_updated cart_page_refreshed cart_totals_refreshed wc_fragments_loaded init_add_payment_method wc_cart_emptied updated_wc_div updated_cart_totals country_to_state_changed updated_shipping_method applied_coupon removed_coupon",
  function (e) {
    console.log(e.type)
  }
)
    $(document.body).on(
        "updated_checkout",
        function(e) {

            console.log(e.type);
                    let total_mem_amount = $('.order_review .order-total:not(.recurring-total) .amount').text();
                    let duration_of_tier_selected = $('.member-benefits-join .elementor-price-table__period span.active').text().toLowerCase();

               
/*
                    let payment_arae = setInterval(function() {
                        if ($('#payment').length > 0 && $('.selected-tier-info').length > 0) {
                            let selected_tier_info_content = $('.elementor-widget-price-table.selected').html();

                            $('.selected-tier-info').html(selected_tier_info_content);

                            $('.selected-tier-info').prependTo('#payment');
                             clearInterval(payment_arae);

                            $('<div class="to-be-removed">Loading Tier Info...</div>').insertBefore('.selected-tier-info .elementor-price-table');
                            $('.selected-tier-info .elementor-price-table').hide();
                            $('.selected-tier-info .elementor-price-table__features-list, .selected-tier-info .elementor-price-table__subheading, .selected-tier-info .elementor-price-table__integer-part span:not(.active), .selected-tier-info .elementor-price-table__period span:not(.active), .selected-tier-info .elementor-price-table__footer').remove();

                            // $('.selected-tier-info .elementor-price-table__heading').text($('.selected-tier-info .elementor-price-table__period span').text());

                            $('.selected-tier-info, .payment_methods').wrapAll('<div class="to-pay-info"></div>');


                       setTimeout(function() {
                        ajaxRequest('POST', 'get_cart_data_variation', {}).then(function(cartDataResponse) {
                                        console.log('Cart Data:', cartDataResponse);

                                        const cartItems = cartDataResponse.cart_items;
                                        let selected_variation = cartItems[0].variation_id;
                                        let tier_duration = cartItems[0].tier_duration;
                                        let tier_price = cartItems[0].line_total;
                                        let tier_description = cartItems[0].variation_description;

                                        $('.to-be-removed').remove();
                                        $('.selected-tier-info .elementor-price-table').show();
                                        //set the the text of the dynamic text under once your application
                                        $('.tier-duration').text('year');

                                        $('.selected-tier-info .elementor-price-table__heading').text(tier_duration);
                                        $('.selected-tier-info .elementor-price-table__integer-part').text(tier_price);
                                        $('.selected-tier-info .elementor-price-table').append(tier_description);

                                        if (tier_duration.toLowerCase().includes('lifetime') ) {
                                            $('.selected-tier-info .elementor-price-table__period').text('Lifetime');
                                        }
                                        else if(tier_duration.toLowerCase().includes('monthly')){
                                            $('.selected-tier-info .elementor-price-table__period').text('Monthly');
                                            $('.tier-duration').text('month');
                                        }
                                        else
                                        {
                                            $('.selected-tier-info .elementor-price-table__period').text('Yearly');

                                        }

                                   
                                    }).catch(function(error) {
                                        console.error('Error:', error);
                                    });
                                },500);



                        }
                    },300);*/

                    //let's move the .upsells above the billing area
                    // $('.upsells').insertBefore('.ast-payment-option-heading');
               
                    //hide the otehr texts when lifetime subscription is selected
                    if($('#subscription_variation').val() === '3700'){
                            $('.non-lifetime-users').hide();
                    }
                    if($('.order_review .cart_item').length > 1){
                            $('.mem-cost').text(total_mem_amount + ' (including the Physical Card you bought)');
                    }
                    else{
                             $('.mem-cost').text(total_mem_amount);
                    }


                    
    //add / remove specific classes on different fields
            setTimeout(function() {
    billing_fields();
                            }, 500);

        }
    );

function toggleStripeCheckoutVisibility() {
    if ($('.billing').is(':visible')) {
           //show the express checkout
                $('#wc-stripe-express-checkout-element, #wc-stripe-express-checkout-button-separator').attr('style', 'display:flex!important');
                $('#wc-stripe-express-checkout-button-separator').insertBefore('#wc-stripe-express-checkout-element-link');
    } else {
        $('#wc-stripe-express-checkout-element').hide(); // Hide the Stripe checkout element
    }
}

    
    //multi step checkout scripts

    // Function to clone the #action-next button and add event handler
    function cloneNextButton() {
        // Check if the button has already been cloned (to avoid multiple clones)
        if ($('#action-next.cloned').length === 0) {
            // Clone the action-next button with its events intact
            const clonedNextButton = $('#action-next').clone(true).addClass('cloned').removeClass('submit-ready jump-to');

            // Add the cloned button to the DOM, in the right place, but keep it hidden initially
            $('.thwmsc-buttons').append(clonedNextButton);
            clonedNextButton.hide(); // Hide the cloned button initially

        }
    }

    // Handle the click event on #action-next button
    $('#action-next').on('click', function() {
        toggleStripeCheckoutVisibility()
                    setTimeout(function() {
$('.woocommerce-error').attr('style', 'display: block !important');
                                }, 1500);
        //check if the plan panel is showing
        let plan_panel = setInterval(function() {
            const plan = $('.thwmsc-tab-panel.plan');

              if (plan.length && plan.css('display') !== 'none') {
                        //set the next button to disabled until the user selected a plan
                            // Check if the current step is not 'personal_info' and if selectedData exists
                if (sessionStorage.getItem('currentStep') !== 'personal_info' && selectedData) {

                    // Click the element based on selectedData
                    $('#variation-' + selectedData).find('.elementor-price-table__button').click();
                    

                    // Log the selectedData to the console
                    console.log(selectedData); // Outputs: 5975 or whatever the stored value is
                }
                        $('#action-next:not(.tier-selected)').prop('disabled',true);
                        clearInterval(plan_panel);

              }

              //remove the currentstep when user purchased
              if (visibleElement.hasClass('order_review')) {
                sessionStorage.removeItem('currentStep');

              }


        },500);

           let parent_id = $('.member-benefits-join').attr('id').replace(/\D/g, '');
           let selected_variation =$('.member-benefits-join .elementor-widget-price-table.selected').closest('.elementor-widget-price-table').attr('id');
           let get_duration = $('.member-benefits-join .elementor-widget-price-table.selected .elementor-price-table__header').find('h3').text().trim();
           //check if we got selected tier
           if ($('.member-benefits-join .elementor-widget-price-table').hasClass('selected') ){
               selected_variation = $('.member-benefits-join .elementor-widget-price-table.selected').closest('.elementor-widget-price-table').attr('id').replace(/\D/g, '');
               get_duration = $('.member-benefits-join .elementor-widget-price-table.selected .elementor-price-table__header').find('h3').text().trim();
           }
        

            if ($('.member-benefits-join .elementor-widget-price-table.selected').closest('.elementor-widget-price-table').hasClass('dual-option')) {
        // Check if the span inside '.elementor-price-table__period' has the 'active' class
        let activePeriod = $('.member-benefits-join .elementor-widget-price-table.selected').find('.elementor-price-table__period span.active');
        if (activePeriod.length) {
            get_duration += ' ' + activePeriod.text().trim();
        }
    }

            const planPanel = $('.thwmsc-tab-panel.plan');
            //if the plan area is showing and the this button got tier-info class update the cart upon click
                if (planPanel.css('display') !== 'none' && $(this).hasClass('tier-selected')) {

                // Make AJAX request to update the subscription variation
                updateSubscriptionVariation(parent_id, selected_variation, get_duration, '');

                //get the cart content after updating
/*                setTimeout(function() {
                    // Chained AJAX requests to handle cart data and upsells
                    ajaxRequest('POST', 'get_cart_data_variation', {}).then(function(cartDataResponse) {
                        console.log('Cart Data:', cartDataResponse);

                        const cartItems = cartDataResponse.cart_items;
                        let selected_variation = cartItems[0].variation_id;

                        $('#variation-' + selected_variation).find('.elementor-price-table__footer a').addClass('selected').text('Selected');

                            //let's check the upsell when the user hover the stripe section
                          let clickedInside = false; // Flag to track if the click has occurred
                          let device_width = $(window).width();

                          if (device_width > 768) {

                          $(document).on('mouseover', function(event) {
                            if (!clickedInside) { // Only proceed if it hasn't been clicked inside yet
                              if ($('.wc_payment_method').has(event.target).length > 0) {
                                // Mouseover was inside the div
                                console.log('Mouseover inside the div');
                                clickedInside = true; // Set the flag to prevent further executions

                                   // Fetch upsells based on the selected variation
                                  return handleUpsells(selected_variation, parent_id, get_duration);
                              } 
                            } 
                          });
                         }else{
                             $(window).on('scroll', function () {
                            // Get the current scroll position
                            let scrollTop = $(window).scrollTop();
                            let windowHeight = $(window).height();
                            let targetOffset = $('.wc_payment_method').offset().top;
                             let billing = $('.thwmsc-tab-panel.billing .thwmsc-tab-content');
                           

                            // If the target class is in the viewport (scroll position + window height >= element position)
                            if (scrollTop + windowHeight >= targetOffset && billing.css('display') !== 'none') {
                       
                            // Fetch upsells based on the selected variation
                             return handleUpsells(selected_variation, parent_id, get_duration);
                                console.log('scrolled to this part');
                              // Optional: Unbind scroll event after triggering once
                                  $(window).off('scroll');
                            }
                          });
                         }

                       
                    }).catch(function(error) {
                        console.error('Error:', error);
                    });
                }, 500);*/
                }
            
            
            // Check periodically if the billing panel is visible and stop when true
            let intervalId = setInterval(function() {
            const billingPanel = $('.thwmsc-tab-panel.billing');
          
            const billingPanelContent = $('.thwmsc-tab-panel.billing .thwmsc-tab-content');


            





            if (billingPanel.length && billingPanelContent.css('display') !== 'none') {
                console.log('Billing panel is visible.');
                                //$('.thwmsc-tab.tab-active a').addClass('thwmsc-completed'); 
            
                                
                    billing_fields();
                            
                        let spcard = $('#billing_ship_physical_card_field').detach();
$(spcard).insertAfter($('#ship-to-different-address'));
                                let rfield = $('#billing_referral_field').detach();
$(rfield).insertBefore($('.woocommerce-terms-and-conditions-wrapper'));
                            let sagreement = $('#billing_acknowledgement_agreement_field').detach();
$(sagreement).insertAfter($('.woocommerce-privacy-policy-text'));
                            
                            //check if the card field from stripe are there
                            if($('#Field-numberInput')){
                                console.log('payment fields are ready!');
                            }
                                if($('#card-panel')){
                                console.log('payment fields are ready!');
                    $('#card-panel input').css('height','46px');
                            }

                // Add the submit-ready class to the next button
                $('#action-next').addClass('submit-ready');
                //                 $('#action-next').removeClass('jump-to');

                // Clone the #action-next button (to keep events)
                cloneNextButton();
                                $('.submit-ready').text('Submit');

                // Remove the previous event listeners and attach a new one for the place order action
                $('#action-next.submit-ready').off('click').on('click', function() {
                                     $(this).prop('disabled', true);

                                    // Re-enable the button after 2 seconds (2000 milliseconds)
                                    setTimeout(function() {
                                            $('#action-next').prop('disabled', false);
                                            console.log('Button re-enabled after 2 seconds.');
                                    }, 2000);  // 2000 milliseconds = 2 seconds
                                                            $('#place_order').click(); // Trigger place order click
                                                    });

                // Stop checking further once the condition has been met
                clearInterval(intervalId);
            }else{
            $('#wc-stripe-express-checkout-element').attr('style', 'display:none!important');   
            }
        }, 500); // Check every 500 milliseconds (adjust as needed)
    });

    // Handle the click event on #action-prev button
    $('#action-prev').on('click', function() {
        toggleStripeCheckoutVisibility()

        //check if the sibling action-next has class tier-selected, hide the timer
        if ($(this).siblings().hasClass('tier-selected')) {
            $('.tier').hide();
        }
        // Remove the submit-ready class from the next button and reset
        $('#action-next.submit-ready').remove();

        //we remove the cloned class, so it ca be cloned again
        $('#action-next').removeClass('cloned');

        console.log('button with submit-class removed, now the original #action-next button is the cloned version');

        // Show the cloned button this will be now the original #action-next button then the cycle continues
        $('#action-next').show().prop('disabled', false);;


    });

    $(document.body).on('checkout_error', function(event, error) {
        setTimeout(function() {
$('.woocommerce-error').attr('style', 'display: block !important');
                                }, 1500);
        if (typeof error === 'undefined') {
            setTimeout(function() {
                // Add a custom error notice using WooCommerce's built-in notice system
                let checkoutSection = $('.woocommerce-checkout');
                let customMessage = 'Please check your payment details and try again.';
                let noticewrap = $('<div class="woocommerce-notices-wrapper"><ul class="woocommerce-error" role="alert"><li>' + customMessage + '</li></ul></div>');
                noticewrap.insertBefore(checkoutSection);
                //           wc_add_notice(customMessage, 'error');
                //           //remove the undefined text
                $('.woocommerce-NoticeGroup-checkout').remove();
                //remove the duplicate on the top of the site nto sure how it happened
                $('.woocommerce-notices-wrapper').each(function() {
                    if (!$(this).closest('.thwmsc-tab-panel-wrapper').length) {
                        $(this).remove();
                    }
                });
            }, 1000); // Try increasing this delay if needed

            console.log('There is an undefined error from for submission');

        }
            
               setTimeout(function() {
            //since we are using a sandbox an error about the payment processing might happen so we will remove it for now
                $('.woocommerce-error').each(function() {
                        var errorMessage = $(this).text(); // Get the text content of the error
                        if (errorMessage.includes('There was an error processing your order. Please check for any charges') ||
                             errorMessage.includes('You cannot add another "Black Circle Soci')) {
                                // If the error message is found, remove it
                                $(this).remove();
                                //console.log('Removed error: "There was an error processing your order. Please check for any charges."');
                        }
                     });
                         }, 1000); // Try increasing this delay if needed

        //check if there are errors before we proceed
        setTimeout(function() {
            if ($('.woocommerce-error').length < 1) {

                console.log('There are no more errors visible.');

                $('.thwmsc-layout-time-line ul.thwmsc-tabs li a').css('pointer-events', 'none');
                $('.thwmsc-tab-panel.order_review , .thwmsc-tab-panel.order_review .thwmsc-tab-content').show();

                $('.thwmsc-tab-panel.billing, .thwmsc-tab-panel.billing .thwmsc-tab-content').hide();
                // Find the third li element within #thwmsc-tabs and add the 'tab-active' class
                $('#thwmsc-tabs li').addClass('tab-active').siblings().removeClass('tab-active');

                // $('#thwmsc-tabs li').eq(1).find('a').addClass('thwmsc-finished-step thwmsc-completed');

                $('#thwmsc-tabs li').find('a').addClass('thwmsc-finished-step thwmsc-completed');
                $('.thwmsc-tab-panel a.thwmsc-accordion-label').addClass('thwmsc-finished-step thwmsc-completed').removeClass('active');
                $('.thwmsc-buttons #action-prev, .thwmsc-buttons #action-next').remove();
            }
        }, 1000); // Try increasing this delay if needed

    });

    //make sure the use a new payment method is clicked as it give a bug if it is not clicked
    $('#wc-stripe-payment-token-new').prop('checked', true);
    //lets make the current tab checked
    //  $('.thwmsc-tab.tab-active a').addClass('thwmsc-completed');
    //remove the extra buttons
        $('.thwmsc-tab-panels .thwmsc-buttons').remove();
    
                
            //since we are using a sandbox an error about the payment processing might happen so we will remove it for now
                $('.woocommerce-error').each(function() {
                        var errorMessage = $(this).text(); // Get the text content of the error
                        if (errorMessage.includes('There was an error processing your order. Please check for any charges') ||
                             errorMessage.includes('You cannot add another "Black Circle Soci')) {
                                // If the error message is found, remove it
                                $(this).remove();
                                //console.log('Removed error: "There was an error processing your order. Please check for any charges."');
                        }
                     });
    
    
    //cehck if the physical card product is on cart if yes check the checkbox inline with it
    var productId = 3333; // Replace with the actual product ID you want to check for in the cart

    // Send an AJAX request to check if the product is in the cart
    $.ajax({
        url: wc_cart_params.ajax_url, // WooCommerce's ajax URL
        method: 'POST',
        data: {
            action: 'check_product_in_cart', // Our custom action
            product_id: productId
        },
              cache: false,
        success: function(response) {
            if (response.success) {
                if (response.data.product_in_cart) {
                    // If the product is in the cart, check the checkbox
                    console.log('Membership card in cart');
                    $('#billing_ship_physical_card').prop('checked', true);
                }else{
                                      $('#billing_ship_physical_card').prop('checked', false);
                                }
            }
        }
    });






    
     // Handle the change event for the checkbox (or any other event you'd like to use)
    $('#billing_ship_physical_card').on('change', function() {
        var productId = $('.product-details').attr('data-id'); // Get the product ID dynamically (adjust as needed)

        // Check if the checkbox is checked or unchecked
        if ($(this).prop('checked')) {
            // Product is being added to the cart
            var data = {
                            action: 'add_to_cart_ajax', // WooCommerce add to cart action
                            product_id: productId,      // Product ID
                            quantity: 1                 // Default quantity, adjust as necessary
                    };

                    $.ajax({
                            url: wc_cart_params.ajax_url,  // WooCommerce AJAX URL
                            type: 'POST',                  // POST method for adding product to the cart
                            data: data,                    // The data being sent (product details)
                            cache: false,                  // Disable caching to ensure fresh data
                            success: function(response) {
                                    if (response.success) {
                                            // Handle success (product successfully added to cart)
                                            console.log('Product added to cart', response);
                                        
                        
                                            // Trigger WooCommerce to update checkout and shipping methods
                                            $(document.body).trigger('update_checkout');

                                    } else {
                                            // Handle failure (product could not be added)
                                            console.log(response);
                                    }
                            },
                            error: function(xhr, status, error) {
                                    // Handle error if the AJAX request fails
                                    console.log('Error:', error);
                                   $('#billing_ship_physical_card').prop('checked', false);
                            }
                    });



        } else {
            // Product is being removed from the cart
            var dataa = {
                action: 'remove_from_cart', // WooCommerce remove from cart action
                product_id: productId // The ID of the product to remove
            };

            $.post(wc_cart_params.ajax_url, dataa, function(response) {
                console.log('Product removed from cart',response);
                if (response.success) {
                    $(document.body).trigger('wc_fragment_refresh'); // Refresh the cart
                                        $(document.body).trigger('update_checkout');
                } else {
                    console.log('Failed to remove product from cart');
                }
            });
        }
    });

    function updateSubscriptionVariation(parent_id, selected_variation, get_duration, initial_selected) {
    // Prepare data for the AJAX request
    var data = {
        action: 'update_subscription_variation',
        product_id: parent_id,
        variation_id: selected_variation,
        variation_attributes: {
            'attribute_subscription-duration': get_duration
        },
        initial_selected: initial_selected
    };

    // Make the AJAX request
    $.post(wc_cart_params.ajax_url, data, function(response) {
        if (response.success) {
            // Trigger cart fragment refresh after updating the cart
            $(document.body).trigger('wc_fragment_refresh');
            $(document.body).trigger('update_checkout');
            console.log('Updated Cart Item Data:', response.data.cart_item);

            var cartItem = response.data.cart_item;  
            var lineTotal = cartItem.line_total; 
            console.log('Variation Price ' + lineTotal);
            // Refresh the payment section since the note is in there
          
        } else {
            console.log('Variation already exist in the cart.');
                 // Trigger cart fragment refresh after updating the cart
            $(document.body).trigger('wc_fragment_refresh');
            $(document.body).trigger('update_checkout');
        }
        console.log(response);
    });
}

function ajaxRequest(type, action, data_param) {
    return new Promise(function(resolve, reject) {
        // Default to an empty object if data_param is an empty string or undefined
        let data = {
            action: action
        };

        // Only add the data_param to the request if it's not empty
        if (data_param && Object.keys(data_param).length > 0) {
            data = {
                ...data,
                ...data_param // Spread data_param into the data object if it's not empty
            };
        }

        jQuery.ajax({
            url: wc_cart_params.ajax_url, // WooCommerce AJAX URL
            type: type, // POST or GET
            data: data,
            success: function(response) {
                resolve(response);
            },
            error: function() {
                reject('Error fetching cart data');
            }
        });
    });
}



          

//end multi step checkout scripts

//script for the new plan tab
$(document).on('click', '.member-benefits-join .elementor-price-table__period > span', function() {

    // Get the class of the clicked span
    let clickedClass = $(this).not('active').attr('class');
    let current_variation = $(this).attr('id').replace(/\D/g, '');
    console.log(current_variation);

       // For each other button, reset the text back to its original value
    $(this).closest('.elementor-price-table__price').siblings('.elementor-price-table__footer').find('.elementor-price-table__button').text('Select').removeClass('selected');

    //change the price table id to be used on aajax add to cart
    $(this).closest('.elementor-widget-price-table').attr('id','variation-'+current_variation);

    // Find the corresponding span with the same class inside .elementor-price-table__integer-part and add 'active'
    $(this).closest('.member-benefits-join').find('.elementor-price-table__integer-part span.' + clickedClass).addClass('active');

     // Remove 'active' from all other spans in .elementor-price-table__integer-part
    $(this).closest('.member-benefits-join').find('.elementor-price-table__integer-part span').not('.' + clickedClass).removeClass('active');

    // Add 'active' class to the clicked span and remove from siblings
    $(this).addClass('active');
    $(this).siblings().removeClass('active');

 
});

    function getCookie(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
}


// Store the original text of each button
let originalText = [];

// Initialize the original text for each button
$('.member-benefits-join .elementor-price-table__button').each(function() {
    originalText.push($(this).text());
});

// Function to handle the update of subscription variation and upsells
function handleUpsells(selected_variation, parent_id, get_duration) {
    let data_param = { "selected_variation": selected_variation };
    return ajaxRequest('POST', 'get_upsells_based_on_selected_variation', data_param)
        .then(function(response) {
            if (response.success) {

            
                let upsell_div_check = setInterval(function() {
                let upsell_div= $('.upsells > div');

                // Check if the 'selected-black-circle-yearly' class is added and sessionStorage does not have the key 'tier_bcs_yearly'
                if (upsell_div.hasClass('selected-black-circle-yearly') && sessionStorage.getItem('tier_bcs_yearly') !== 'true') {
                    sessionStorage.setItem('tier_bcs_yearly', 'true');
                }

                // Check if the 'selected-black-circle-monthly' class is added and sessionStorage does not have the key 'tier_bcs_monthly'
                if (upsell_div.hasClass('selected-black-circle-monthlly') && sessionStorage.getItem('tier_bcs_monthly') !== 'true') {
                    sessionStorage.setItem('tier_bcs_monthly', 'true');
                }

                // Check if the 'selected-inner-circle' class is added and sessionStorage does not have the key 'tier_bcs_inner_circle'
                if (upsell_div.hasClass('selected-inner-circle') && sessionStorage.getItem('tier_bcs_inner_circle') !== 'true') {
                    sessionStorage.setItem('tier_bcs_inner_circle', 'true');
                }

                clearInterval(upsell_div_check);
                },500);

                if (sessionStorage.getItem('tier_bcs_monthly') !== 'true' && response.data.tier_info == "bcs-monthly" || sessionStorage.getItem('tier_bcs_yearly') !== 'true' && response.data.tier_info == "bcs-yearly"  || sessionStorage.getItem('tier_bcs_inner_circle') !== 'true' && response.data.tier_info == "bcs-inner-circle" ) {
                $('.upsells').html(response.data.html);

                        let timer_check = setInterval(function() {
                        if ($('.timer').length > 0 && $('#action-next').hasClass('tier-selected')) {
                            var timer2 = "5:01";  // Initial timer value
                            var interval = setInterval(function() {
                                var timer = timer2.split(':');
                                var minutes = parseInt(timer[0], 10);
                                var seconds = parseInt(timer[1], 10);
                                
                                --seconds;
                                minutes = (seconds < 0) ? --minutes : minutes;

                                if (minutes < 0 && !$('#take-it').hasClass('selected')) {
                                    clearInterval(interval); // Timer reached 0:00, stop interval
                                    $('.tier').hide();  // Adjust this selector as needed
                                }

                                seconds = (seconds < 0) ? 59 : seconds;
                                seconds = (seconds < 10) ? '0' + seconds : seconds;
                                $('.timer').html(minutes + ':' + seconds); // Update timer display
                                timer2 = minutes + ':' + seconds;  // Update timer variable
                            }, 1000);

                            // Stop checking further once the condition has been met
                            clearInterval(timer_check);

                            // Set a cookie to prevent showing the timer again
                        //    document.cookie = "timer_shown=true; path=/; max-age=" + (30 * 24 * 60 * 60); // Cookie expires in 30 days
                        }
                      
                    }, 500); // Check every 500 milliseconds (adjust as needed)
                }

                $(document).on('click', '.tier #take-it', function(e) {
                    e.preventDefault();
                
                    $(this).addClass('selected');
                 
                    let productId = $(this).attr('data-id');
                    let upsell_duration = $(this).attr('data-duration');
                    updateSubscriptionVariation(parent_id, productId, upsell_duration, selected_variation);

                         setTimeout(function() {
                            $('.tier, .timer').hide();
                         },1000);

                });

                $(document).on('click', '.tier #pass', function(e) {
                    updateSubscriptionVariation(parent_id, selected_variation, get_duration, '');
                    $(this).closest('.tier').remove();
                });
            }
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
}

// Handle add-to-cart on page load when the user came from preview
$(window).on('load', function() {

    console.log('All resources have been fully loaded');

    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.toString()) {
        let tier = urlParams.get('tier');
        let format_duration = urlParams.get('duration').replace(/-/g, ' ').toLowerCase();
        let get_duration = format_duration.replace(/\b\w/g, function(char) {
            return char.toUpperCase();
        });

        let parent_id = $('.member-benefits-join').attr('id').replace(/\D/g, '');
         const planPanel = $('.thwmsc-tab-panel.plan');

           if (planPanel.css('display') !== 'none')  {
                        $('#action-next').addClass('tier-selected');


                  }

    }

/*    //show the step based on url hash
    let visibleElement = $('.woocommerce-checkout > .thwmsc-tab-panel:visible');
    let get_hash = location.hash.substring(1);

    //show the step containing the hash class
    $(`.${get_hash}`).attr('style','display:block!important').find('.thwmsc-tab-content').attr('style','display:block!important');

    if (visibleElement.length) {
        let get_step_number = visibleElement.attr('id').split('-').pop();
        //call the jump from multi step plugin function
        thwmscJumpToStep(get_step_number);
    }*/

     let get_step = sessionStorage.getItem('currentStep');
     console.log('current step:' +get_step);

});

// Add to cart when select is clicked
$(document).on('click', '.member-benefits-join .elementor-price-table__button', function() {
    let parent_id = $('.member-benefits-join').attr('id').replace(/\D/g, '');
    let selected_variation = $(this).closest('.elementor-widget-price-table').attr('id').replace(/\D/g, '');
    let get_duration = $(this).parent().siblings('.elementor-price-table__header').find('h3').text().trim();

    if ($(this).closest('.elementor-widget-price-table').hasClass('dual-option')) {
        // Check if the span inside '.elementor-price-table__period' has the 'active' class
        let activePeriod = $(this).parent().siblings('.elementor-price-table__price').find('.elementor-price-table__period span.active');
        if (activePeriod.length) {
            get_duration += ' ' + activePeriod.text().trim();
        }
    }


    console.log(get_duration);
    console.log(selected_variation);

    //le add selected class to the parent container
    $(this).closest('.elementor-widget-price-table').addClass('selected');
    $(this).closest('.elementor-widget-price-table').siblings().removeClass('selected');

    $(this).addClass('selected').text('Selected');
    $(this).closest('.elementor-widget-price-table').siblings().find('.elementor-price-table__button').removeClass('selected');

    // Reset text for all other buttons
    $('.member-benefits-join .elementor-price-table__button').not(this).each(function(index) {
        $(this).text(originalText[index]);
    });


     // Make AJAX request to update the subscription variation
     updateSubscriptionVariation(parent_id, selected_variation, get_duration, '');

     // If formData exists, update it; otherwise, initialize an empty object
    if (formData) {
        formData.selected_data = selected_variation; // Add or modify your key-value pair
    } else {
        formData = { selected_data: selected_variation }; // Create new data if no previous data
    }

     //add data to the formdata session with the selected variation
     sessionStorage.setItem('formData', JSON.stringify(formData));

            // Enable the next button after user selects a plan, add a delay for ajax scripts to load
    setTimeout(function() {
        $('#action-next').addClass('tier-selected').prop('disabled', false);
   }, 2000);



});



});



</script>