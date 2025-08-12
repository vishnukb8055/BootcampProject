import { webpack } from "webpack";

export default webpack(){
    plugins:[
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env),
        }),
    ],
};