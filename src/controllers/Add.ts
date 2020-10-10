import ViewController		from "@/services/router/ViewController";
import { iRoutingParams }	from "@/services/router/Router";
import AppStorage			from "@/services/storage/AppStorage";
import TextInput			from "@/view/components/TextInput";
import Checkbox				from "@/view/components/StarredCheckbox";
import DropdownDataList		from "@/view/components/DropdownDataList";
import Button				from "@/view/components/Button";
import HashtagStorage		from "@/models/HashtagStorage";
import html_ids				from "@/config/html_ids";
import Title				from "@/view/components/Title";

const htmlString	= require( '@/view/add.html' ).default;

interface iComponents {
	hashtagInput: TextInput,
	categoryListInput: DropdownDataList,
	starredInput: Checkbox,
	submitButton: Button,
	errorTitle: Title,
}

export default class Add extends ViewController
{
	private storageModel: HashtagStorage;
	protected components: iComponents = {
		hashtagInput		: null,
		categoryListInput	: null,
		starredInput		: null,
		submitButton		: null,
		errorTitle			: null
	};

	constructor( rootElement : HTMLElement )
	{
		super( rootElement, htmlString );

		this.storageModel	= new HashtagStorage( new AppStorage() );
		this.onSubmit		= this.onSubmit.bind( this );
	}

	public mount( params: iRoutingParams )
	{
		super.mount( params );
		this.setComponents();
		this.setDataListCategories();
	}

	public unmount()
	{
		super.unmount();
		this.unsetComponents();
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	private setComponents()
	{
		this.components.hashtagInput		= new TextInput( html_ids.ADD_HASHTAG );
		this.components.categoryListInput	= new DropdownDataList( html_ids.ADD_CATEGORY );
		this.components.starredInput		= new Checkbox( html_ids.ADD_STARRED );
		this.components.errorTitle			= new Title( html_ids.ADD_ERROR_TITLE );
		this.components.submitButton		= new Button( html_ids.ADD_SUBMIT, this.onSubmit );

		this.components.errorTitle.hide();
		this.components.starredInput.uncheck();
	}

	private setDataListCategories()
	{
		const categories	= this.storageModel.getCategories();

		for ( const category in categories )
		{
			this.components.categoryListInput.addListItem( category );
		}
	}

	private onSubmit()
	{
		const { hashtagInput, categoryListInput, starredInput, errorTitle }	= this.components;

		const category	= categoryListInput.getValue();
		const hashtag	= hashtagInput.getValue().replace( '#', '' );

		if ( ! this.validateInputValues( category, hashtag ) )
		{
			errorTitle.show();
			return;
		}

		errorTitle.hide();

		this.storageModel.addHashtag(
			category,
			hashtag,
			starredInput.getIsSelected()
		);

		this.resetInputs( category );
	}

	private validateInputValues( category: string, hashtag: string )
	{
		if ( category.length === 0 || hashtag.length === 0 )
		{
			return false;
		}

		return true;
	}

	private resetInputs( category: string )
	{
		const { hashtagInput, categoryListInput, starredInput }	= this.components;

		categoryListInput.setValue( category );
		categoryListInput.addListItem( category );
		hashtagInput.setValue( '' );
		starredInput.uncheck();
	}
}