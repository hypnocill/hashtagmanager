import ViewController		from "@/services/router/ViewController";
import { iRoutingParams }	from "@/services/router/Router";
import NavButton			from "@/view/components/NavButton";
import html_ids				from "@/config/html_ids";
import Navigator			from "@/services/navigator/navigator";

const htmlString	= require('@/view/navigation.html').default;

interface iComponents {
	navButtons: NavButton[]
}

export default class Navigation extends ViewController
{
	components: iComponents	= {
		navButtons: [],
	};

	constructor( rootElement : HTMLElement )
	{
		super( rootElement, htmlString );
	}

	public mount( params: iRoutingParams )
	{
		super.mount( params );
		this.setNavButtons();
	}

	public unmount()
	{
		super.unmount();
		this.unsetComponents();
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	private setNavButtons()
	{
		const navButtonElements	= document.getElementsByClassName( html_ids.CLASS_NAV_BUTTON );

		for ( const navButtonElement of navButtonElements )
		{
			const navButton	= new NavButton(
				navButtonElement as HTMLAnchorElement,
				'',
				{},
				this.highlight.bind( this )
			);

			this.highlight( navButton );
			this.components.navButtons.push( navButton );
		}
	}

	private highlight( navButton: NavButton )
	{
		if ( Navigator.getCurrentPath() === navButton.getHref() )
		{
			for ( const navButton of this.components.navButtons )
			{
				navButton.removeHightlight();
			}

			navButton.highlight();
		}
	}
}