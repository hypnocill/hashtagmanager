import html_ids		from "@/config/html_ids";
import Utils		from "@/services/utils/Utils";
import Component	from "@/services/component/Component";

const modalHtmlString	= require( '@/view/components/Modal/modal_template.html' ).default;

export default class Modal extends Component<HTMLElement>
{
	element: HTMLElement;
	parent: HTMLElement;

	constructor( parent: HTMLElement )
	{
		super( Utils.parseHtmlString( modalHtmlString ) );
		this.parent	= parent;
	}

	public show( content: string )
	{
		const paragraph		= this.element.querySelector( 'p' );

		paragraph.innerHTML	= content;

		this.element.style.display	= 'block';
		this.element.addEventListener( 'click', this.onClick.bind( this ) );
		this.parent.appendChild( this.element );
	}

	public hide()
	{
		this.element.style.display	= 'none';
		this.element.remove();
	}

	public destructor()
	{
		this.element.remove();
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	private onClick( event: Event )
	{
		const eventTarget = event.target as HTMLElement;
	
		if ( eventTarget === this.element || eventTarget.classList.contains( html_ids.CLASS_MODAL_CLOSE ) )
		{
			this.hide();
		}
	}
}
