/***************************************************************************************************************************************************************
 *
 * Get settings and merge with defaults
 *
 * SETTINGS     - Keeping our settings across multiple imports
 * SETTINGS.get - Getting our settings
 * SETTINGS.set - Merge with default settings
 *
 * @flow
 **************************************************************************************************************************************************************/

'use strict';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import Fs from 'fs';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Local
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
import { Log, Style } from './helper';
import { Path } from './path';


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Types
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
/*::
export type Settings = {
	folder: {
		cwd: string,
		content: string,
		code: string,
		assets: string,
		site: string,
		index: string,
		homepage: string
	},
	layouts: {
		page: string,
		partial: string
	},
	site: {
		root: string,
		doctype: string,
		redirectReact: boolean,
		markdownRenderer: string,
		watchTimeout: number,
	}
}
*/


/**
 * Keeping our settings across multiple imports
 *
 * @type {Object}
 */
export const SETTINGS = {
	/**
	 * The default settings
	 *
	 * @type {Object}
	 */
	defaults: {
		folder: {
			cwd: Path.normalize(`${ process.cwd() }/`),
			content: Path.normalize(`${ process.cwd() }/content/`),
			code: Path.normalize(`${ process.cwd() }/layout/`),
			assets: Path.normalize(`${ process.cwd() }/assets/`),
			site: Path.normalize(`${ process.cwd() }/dist/`),
			styles: Path.normalize(`${ process.cwd() }/styles/`),
			js: Path.normalize(`${ process.cwd() }/js/`),
			index: 'index',
			homepage: 'index',
		},
		layouts: {
			page: 'templates/_default',
			partial: 'partials/_default',
		},
		site: {
			root: Path.normalize(`/`),
			doctype: '<!DOCTYPE html>', // https://github.com/facebook/react/issues/1035
			redirectReact: true,
			markdownRenderer: '',
			watchTimeout: 400,
			browserSync: {},
			globalProp: {},
		},
	},


	/**
	 * Getting our settings
	 *
	 * @return {object} - The settings object
	 */
	get: ()/*: Settings */ => {
		return SETTINGS.defaults;
	},


	/**
	 * Merge with default settings
	 *
	 * @param  {object} localSettings - The new settings object to be merged
	 *
	 * @return {object}               - Our new settings
	 */
	set: ( localSettings /*: Settings */ )/*: Settings */ => {
		Log.verbose(`Merging default setting with`);
		Log.verbose( Style.yellow( JSON.stringify( localSettings ) ) );

		if( localSettings ) {
			if( !localSettings.folder ) {
				localSettings.folder = {};
			}
			if( !localSettings.layouts ) {
				localSettings.layouts = {};
			}
			if( !localSettings.site ) {
				localSettings.site = {};
			}

			// $FlowFixMe
			delete localSettings.folder.cwd; // ignore the cwd key

			// let’s make them absolute
			if( localSettings.folder.content && !Path.isAbsolute( localSettings.folder.content ) ) {
				localSettings.folder.content = Path.normalize(`${ process.cwd() }/${ localSettings.folder.content }/`);
			}
			if( localSettings.folder.code && !Path.isAbsolute( localSettings.folder.code ) ) {
				localSettings.folder.code = Path.normalize(`${ process.cwd() }/${ localSettings.folder.code }/`);
			}
			if( localSettings.folder.site && !Path.isAbsolute( localSettings.folder.site ) ) {
				localSettings.folder.site = Path.normalize(`${ process.cwd() }/${ localSettings.folder.site }/`);
			}
			if( localSettings.folder.assets && !Path.isAbsolute( localSettings.folder.assets ) ) {
				localSettings.folder.assets = Path.normalize(`${ process.cwd() }/${ localSettings.folder.assets }/`);
			}

			const newSettings = {};

			newSettings.folder = Object.assign( SETTINGS.defaults.folder, localSettings.folder );
			newSettings.layouts = Object.assign( SETTINGS.defaults.layouts, localSettings.layouts );
			newSettings.site = Object.assign( SETTINGS.defaults.site, localSettings.site );

			SETTINGS.defaults = newSettings;

			Log.verbose(`New settings now:`);
			Log.verbose( Style.yellow( JSON.stringify( newSettings ) ) );

			return newSettings;
		}
		else {
			return SETTINGS.get();
		}
	},
};
