export const equal = {

    if_eq: function(a, b, opts) {
        if (a == b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    },

    if_gt: function(a, b, opts) {
        if (a > b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    }
    
}