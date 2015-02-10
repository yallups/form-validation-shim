# form-validation-shim
light weight html5 form validation shim

# In Short...
include this script before any others and your forms wont be submitted unless all html5 inputs are valid. It will not interfere with default browser behaviour. 

# Where to include
Script should be injected in the head to take precedence over other event binders. 
At the moment this is not leveraged but we will want to prioritize this scripts `onSubmit` function before any other handlers.

# Styles
There is only an `invalid` style applied to inputs when a form is determined to be `invalid` but I hope to have many more custom styles and tips that may be overwritten.

