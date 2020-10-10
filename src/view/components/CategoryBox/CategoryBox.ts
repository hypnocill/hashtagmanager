import html_ids		from "@/config/html_ids";
import Component	from "@/services/component/Component";
import Utils		from "@/services/utils/Utils";
import NavButton	from "@/view/components/NavButton";

const htmlCategoryBoxString	= require( '@/view/components/CategoryBox/category_box_template.html' ).default;

export default class CategoryBox extends Component<HTMLDivElement>
{
	navButton: NavButton;
	content: HTMLElement;
	category: string;

	constructor(
		category: string,
		href: string,
		data: any = {},
		onDelete: ( category: string ) => void = () => {}
	) {
		super( Utils.parseHtmlString( htmlCategoryBoxString ) as HTMLDivElement );

		const anchor		= this.element.querySelector( 'a' );
		const div			= this.element.querySelector( 'div' );
		const deleteIcon	= this.element.querySelector( '.' + html_ids.CLASS_ACTION_DELETE );
		
		this.category	= category;
		div.innerHTML	= category + ' ' + div.innerHTML;
		this.navButton	= new NavButton( anchor, href, data );

		deleteIcon.addEventListener( 'click', ( event: Event ) => onDelete( category ) );
	}

	public getCategory(): string
	{
		return this.category;
	}

	public setHref( href: string )
	{
		this.navButton.setHref( href );
	}

	public mount( element: HTMLElement )
	{
		element.appendChild( this.element );
	}

	public destructor()
	{
		this.element.remove();
	}
}
