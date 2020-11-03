import html_ids							from "@/config/html_ids";
import HashtagStorage, { tCategory }	from "@/models/HashtagStorage";
import ViewController					from "@/services/router/ViewController";
import { iRoutingParams }				from "@/services/router/Router";
import AppStorage						from "@/services/storage/AppStorage";
import Utils							from "@/services/utils/Utils";
import Title							from "@/view/components/Title";
import HashtagBox						from "@/view/components/HashtagBox/HashtagBox";
import Button							from "@/view/components/Button";
import Modal							from "@/view/components/Modal/Modal";

const htmlString						= require( '@/view/category.html' ).default;

export const HASHTAG_LIMIT_QUERY_PARAM		= 'number';
export const RANDOM_HASHTAGS_QUERY_PARAM	= 'random';

interface iComponents	{
	title: Title,
	hashtagBoxes: HashtagBox[],
	copyButton: Button,
	modal: Modal
}

/**
 * @todo	Replace all 'this.storageModel.getCategory( category )' uses
 * 			with 'this.storageModel.getCategoryByCriteria( category, hashtagsNumber )' when it's available
 */
export default class Category extends ViewController
{
	private storageModel: HashtagStorage;
	protected components: iComponents = {
		title	: null,
		hashtagBoxes: [],
		copyButton: null,
		modal: null
	};

	constructor( rootElement : HTMLElement )
	{
		super( rootElement, htmlString );
		this.storageModel	= new HashtagStorage( new AppStorage() );
	}

	public mount( params: iRoutingParams )
	{
		super.mount( params );

		const category							= decodeURIComponent( params.urlParam );
		const [hashtagsLimit, hashtagsRandom]	= this.getQueryParams();
		const hashtagsFromNav					= Object.keys( params.data ).length
												? params.data as tCategory
												: null
		const hashtags							= this.storageModel.getCategoryByCriteria( category, hashtagsLimit, hashtagsRandom, hashtagsFromNav );

		this.components.title	= new Title( html_ids.CATEGORY_TITLE, category );
		this.setCopyButton( category, hashtagsLimit );
		this.setHashtagBoxes( hashtags, category );
	}

	public unmount()
	{
		super.unmount();
		this.unsetComponents();
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	private setCopyButton( category: string, hashtagLimit: number )
	{
		this.components.modal	= new Modal( this.rootElement );

		const onClickCallback	= () =>
		{
			const hashtagsArray		= [];

			for ( const hashtagBox of this.components.hashtagBoxes )
			{
				hashtagsArray.push( '#' + hashtagBox.getHashtag() );
			}

			const hashtagsString	= hashtagsArray.join( ' ' );
			const modalMessageHtml	= '<h2>Copied hashtags to clipboard:</h2><p>' + hashtagsString + '</p>';
			Utils.copyToClipboard( hashtagsString );
			this.components.modal.show( modalMessageHtml );
		}

		this.components.copyButton	= new Button( html_ids.CATEGORY_COPY_HASHTAGS, onClickCallback );
	}

	private setHashtagBoxes( hashtagsData: tCategory, category: string ): void
	{
		this.components.hashtagBoxes	= [];

		const list	= document.getElementById( html_ids.CATEGORY_LIST ) as HTMLDivElement;

		for ( const hashtag in hashtagsData )
		{
			const starred	= hashtagsData[hashtag];

			const hashtagBox	= new HashtagBox(
				hashtag,
				starred,
				category,
				this.deleteHashtag.bind( this ),
				this.storageModel.updateHashtag.bind( this.storageModel )
			);

			hashtagBox.mount( list );
			this.components.hashtagBoxes.push( hashtagBox );
		}
	}

	private deleteHashtag( hashtag: string, category: string )
	{
		this.storageModel.deleteHashtag( hashtag, category );
		this.unsetHashtagBoxes();

		const [hashtagsLimit, hashtagsRandom]	= this.getQueryParams();

		const hashtagsData	= this.storageModel.getCategoryByCriteria( category, hashtagsLimit, hashtagsRandom );
		this.setHashtagBoxes( hashtagsData, category );
	}

	private unsetHashtagBoxes()
	{
		for ( const hashtagBox of this.components.hashtagBoxes )
		{
			hashtagBox.destructor();
		}
	}

	private getQueryParams(): any[]
	{
		const queryParams		= new URLSearchParams( window.location.search );
		const hashtagsLimit		= Number( queryParams.get( HASHTAG_LIMIT_QUERY_PARAM ) );
		const hashtagsRandom	= Boolean( queryParams.get( RANDOM_HASHTAGS_QUERY_PARAM ) );

		return [hashtagsLimit, hashtagsRandom];
	}
}