/**
 *
 */
module.exports.imRecipeOwner = function(req, recipe) {
    //console.info("im recipe owner. user session: " + req.session.user_id + " recipe user id: " + recipe.user_id);
    if (req.session.user_id) {
        if (recipe.user_id) {
            return req.session.user_id === recipe.user_id;
        }
    }
    return false;
};

/**
 *
 */
module.exports.allowEdition = function(req, recipe) {
    return req.session.is_user_admin === true || this.imRecipeOwner(req, recipe);
};
/**
 *
 */
module.exports.isEmailvalid = function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
