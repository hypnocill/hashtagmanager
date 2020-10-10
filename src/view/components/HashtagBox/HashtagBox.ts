import html_ids			from "@/config/html_ids";
import Component		from "@/services/component/Component";
import Utils			from "@/services/utils/Utils";
import StarredCheckbox	from "@/view/components/StarredCheckbox";

const htmlCategoryBoxString	= require( '@/view/components/HashtagBox/hashtag_box_template.html' ).default;

export default class HashtagBox extends Component<HTMLDivElement>
{
	content: HTMLElement;
	hashtag: string;

	constructor(
		hashtag: string,
		starred: boolean,
		category: string,
		onDelete: ( hashtag: string, category: string ) => void,
		onEdit: ( category: string, hashtag: string, starred: boolean ) => void
	) {
		super( Utils.parseHtmlString( htmlCategoryBoxString ) as HTMLDivElement );

		this.hashtag		= hashtag;

		const div			= this.element.querySelector( '.' + html_ids.CLASS_LIST_BOX );
		const deleteIcon	= this.element.querySelector( '.' + html_ids.CLASS_ACTION_DELETE );
		const starCheckbox	= this.element.querySelector( '.' + html_ids.CLASS_ACTION_STAR ) as HTMLInputElement;

		const starCheckboxComponent	= new StarredCheckbox( starCheckbox );
		this.setStarredCheckboxState( starCheckboxComponent, starred );

		deleteIcon.addEventListener( 'click', ( event: Event ) => onDelete( hashtag, category ) );
		starCheckbox.addEventListener( 'click', ( event: Event ) => {
			onEdit( category, hashtag, starCheckboxComponent.getIsSelected() );
		} );

		div.innerHTML	= '#' + hashtag + ' ' + div.innerHTML;
	}

	public getHashtag(): string
	{
		return this.hashtag;
	}

	public mount( element: HTMLElement )
	{
		element.appendChild( this.element );
	}

	public destructor()
	{
		this.element.remove();
	}

	////////////////////////////////////////////////////////////////////////////////////////////////

	private setStarredCheckboxState( starCheckboxComponent: StarredCheckbox, starred: boolean )
	{
		if ( starred )
		{
			starCheckboxComponent.check();
		}
		else
		{
			starCheckboxComponent.uncheck();
		}
	}
}
