
import { expressMiddleware as clsMiddleware } from 'cls-rtracer';


export const tracerMiddleware = clsMiddleware({
	useHeader: true,
	headerName: 'x-correlationid',
});
