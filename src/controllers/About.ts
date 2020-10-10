import ViewController	from "@/services/router/ViewController";

const htmlString	= require( '@/view/about.html' ).default;

export default class About extends ViewController
{
	constructor( rootElement : HTMLElement )
	{
		super( rootElement, htmlString );
	}
}