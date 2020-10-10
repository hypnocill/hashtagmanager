import ViewController	from "@/services/router/ViewController";

const htmlString	= require( '@/view/404.html' ).default;

export default class NotFound extends ViewController
{
	constructor( rootElement : HTMLElement )
	{
		super( rootElement, htmlString );
	}
}