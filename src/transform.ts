import { Transform } from 'vite';

export const rustTransform: Transform = {
    test({ path, isBuild }) {
        console.log('>>> test', path);
        // debugger;
        return false;
    },
    transform({ code, path }) {
        // debugger;
        console.log('>>>>>>>>> xform', path);
        return '123';
        // return {
        //     code: '',
        //     map: {
        //         mappings: '',
        //     },
        // }
    },
};