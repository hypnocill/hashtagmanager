import html_ids from "@/config/html_ids";
import Component from "@/services/component/Component";
import Navigator from "@/services/navigator/navigator";

export default class NavButton extends Component<HTMLAnchorElement>
{
	data: object;
	onNavigate: ( event: Event ) => void;
	afterNavigation: ( navButton: NavButton ) => void;

	constructor(
		id: string | HTMLAnchorElement,
		href: string = '',
		data: object = {},
		afterNavigation: ( navButton: NavButton ) => void = ( navButton: NavButton ) => {},
	) {
		super( id );
		this.data				= data;
		this.onNavigate			= this.navigate.bind( this );
		this.afterNavigation	= afterNavigation;

		this.element.addEventListener( 'click', this.onNavigate );

		if ( href )
		{
			this.element.setAttribute( 'href', href );
		}
	}

	public destructor()
	{
		this.element.removeEventListener( 'click', this.onNavigate );
	}

	public highlight()
	{
		this.element.classList.add( html_ids.CLASS_NAV_BUTTON_HIGHLIGHT );
	}

	public removeHightlight()
	{
		this.element.classList.remove( html_ids.CLASS_NAV_BUTTON_HIGHLIGHT );
	}

	public getHref(): string
	{
		return this.element.getAttribute( 'href' );
	}

	public setHref( url: string )
	{
		this.element.setAttribute( 'href', url );
	}

	////////////////////////////////////////////////////////////////////////////////////////////////

	private navigate( event: Event )
	{
		event.preventDefault();
		Navigator.go( this.element.getAttribute( 'href' ), this.data );
		this.afterNavigation( this );
	}
}
