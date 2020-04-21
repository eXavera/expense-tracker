let view;

export default {
    error: {
        display: function(msg) {
            view.setError(msg);
        },
        clear: function() {
            view.clearError();
        }
    },
    setView: function(newView) {
        view = newView;
    }
};
