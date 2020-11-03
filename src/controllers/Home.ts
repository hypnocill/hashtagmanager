import html_ids														from "@/config/html_ids";
import routes														from "@/config/routes";
import HashtagStorage, { tCategories }								from "@/models/HashtagStorage";
import { iRoutingParams }											from "@/services/router/Router";
import ViewController												from "@/services/router/ViewController";
import AppStorage													from "@/services/storage/AppStorage";
import Utils														from "@/services/utils/Utils";
import CategoryBox													from "@/view/components/CategoryBox/CategoryBox";
import Button														from "@/view/components/Button";
import FileInput													from "@/view/components/FileInput";
import NumberInput													from "@/view/components/NumberInut";
import Modal														from "@/view/components/Modal/Modal";
import Checkbox														from "@/view/components/Checkbox";
import { HASHTAG_LIMIT_QUERY_PARAM, RANDOM_HASHTAGS_QUERY_PARAM }	from "@/controllers/Category";

const htmlString			= require( '@/view/home.html' ).default;

interface iComponents	{
	categoryBoxes: CategoryBox[],
	copyButton: Button,
	fileImport: FileInput,
	numberInput: NumberInput,
	modal: Modal,
	randomCheckbox: Checkbox
}

export default class Home extends ViewController
{
	private alreadyVisited: boolean;
	private storageModel: HashtagStorage;
	protected components: iComponents = {
		categoryBoxes : [],
		copyButton: null,
		fileImport: null,
		numberInput: null,
		modal: null,
		randomCheckbox: null
	};

	constructor( rootElement : HTMLElement )
	{
		super( rootElement, htmlString );
		this.storageModel	= new HashtagStorage( new AppStorage() );
		this.alreadyVisited	= this.storageModel.getAlreadyVisited();
	}

	public mount( params: iRoutingParams )
	{
		super.mount( params );

		const categories	= this.storageModel.getCategories();

		if ( ! this.alreadyVisited )
		{
			this.setWelcomeModal();
			this.storageModel.setAlreadyVisited();
			this.alreadyVisited	= true;
		}

		this.setRandomHashtagsCheckbox();
		this.setHashtagNumberInput();
		this.setCategoryBoxes( categories );
		this.setExportAsJsonButton();
		this.setImportJsonButton();
	}

	public unmount()
	{
		super.unmount();
		this.unsetComponents();
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	private setWelcomeModal()
	{
		this.components.modal	= new Modal( this.rootElement );
		const message			= '<h1>Welcome!</h1><p>This is probably your first time using <b>Simple Hashtag Manager</b>!'
								+ '<br/><br/>Go to the <b>Add</b> page and start adding your hashtags!';

		this.components.modal.show( message );
	}

	private setHashtagNumberInput()
	{
		const onChangeCallback	= ( newValue: number ) =>
		{
			this.storageModel.setLastHashtagLimit( newValue );

			for ( const categoryBox of this.components.categoryBoxes )
			{
				const url	= this.buildUrlToCategoryPage( categoryBox.getCategory() );
				categoryBox.setHref( url );
			}
		}

		this.components.numberInput	= new NumberInput( html_ids.HOME_NUMBER_INPUT, onChangeCallback );
		const cachedHashtagLimit	= this.storageModel.getLastHashtagLimit()

		if ( cachedHashtagLimit )
		{
			this.components.numberInput.setValue( String( cachedHashtagLimit ) );
		}
	}

	private setRandomHashtagsCheckbox()
	{
		const onChangeCallback	= ( selected: boolean ) =>
		{
			for ( const categoryBox of this.components.categoryBoxes )
			{
				const url	= this.buildUrlToCategoryPage( categoryBox.getCategory(), selected );
				categoryBox.setHref( url );
			}
		}

		this.components.randomCheckbox	= new Checkbox( html_ids.HOME_SET_RANDOM_CHECKBOX, onChangeCallback );
	}

	private unsetCategoryBoxes()
	{
		for ( const categoryBox of this.components.categoryBoxes )
		{
			categoryBox.destructor();
		}
	}

	private setCategoryBoxes( categoriesData: tCategories = null )
	{
		this.components.categoryBoxes	= [];
		const categories				= categoriesData ? categoriesData : this.storageModel.getCategories();

		const list = document.getElementById( html_ids.HOME_CATEGORY_LIST ) as HTMLDivElement;

		for ( const category in categories )
		{
			const categoryData		= categories[category];
			const randomHashtags	= this.components.randomCheckbox.getIsSelected();

			const categoryBox	= new CategoryBox(
				category,
				this.buildUrlToCategoryPage( category, randomHashtags ),
				categoryData,
				this.deleteCategory.bind( this )
			);

			categoryBox.mount( list );
			this.components.categoryBoxes.push( categoryBox );
		}
	}

	private deleteCategory( category: string )
	{
		this.storageModel.deleteCategory( category );
		this.reloadCategories();
	}

	private setExportAsJsonButton()
	{
		const onClickCallback	= () =>
		{
			const categories	= JSON.stringify( this.storageModel.getCategories() );
			const fileName		= `categories-${ Date.now() }.json`;
			Utils.downloadAsFile( fileName, categories );
		}

		this.components.copyButton	= new Button( html_ids.HOME_COPY_ALL, onClickCallback );
	}

	private setImportJsonButton()
	{
		const onImportCallback	= ( event: Event ) =>
		{
			const input	= event.target as HTMLInputElement;
			const file	= input.files[0];

			if ( file )
			{
				const reader	= new FileReader();
				reader.readAsText( file )
				reader.onload	= onFileReadCallback;
			}

			input.value	= null;
		}

		const onFileReadCallback	= ( event: any ) => 
		{
			try
			{
				const categories	= JSON.parse( event.target.result );

				for ( const key in categories )
				{
					this.storageModel.addCategory( key, categories[key] );
					this.reloadCategories();
				}
			}
			catch( error )
			{
				const message	= '<h2>Something Went Wrong!</h2>'
				+ '<p>The file you try to import may have a wrong format.'
				+ '<br/>Make sure to only import files that were exported by this app!';
				throw new Error( message );
			}
		}

		this.components.fileImport	= new FileInput( html_ids.HOME_IMPORT_ALL, onImportCallback );
	}

	private buildUrlToCategoryPage( category: string, randomHashtags: boolean = false ): string
	{
		let hashtagNumberParams: { [key: string]: string; }	= {
			[HASHTAG_LIMIT_QUERY_PARAM]	: this.components.numberInput.getValue()
		};

		if ( randomHashtags )
		{
			hashtagNumberParams[RANDOM_HASHTAGS_QUERY_PARAM]	= String( randomHashtags );
		}

		const urlQueryParams	= new URLSearchParams( hashtagNumberParams );

		return routes.CATEGORY + category + '?' + urlQueryParams.toString();
	}

	private reloadCategories()
	{
		this.unsetCategoryBoxes();
		this.setCategoryBoxes();
	}
}