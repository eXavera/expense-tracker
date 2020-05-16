module.exports = {
    esnureIsValid: function(joiRule, subject) {
        const result = joiRule.validate(subject);
        if (result.error) {
            throw {
                validationError: result.error.details.map(d => d.message)
            };
        }
    }
};
