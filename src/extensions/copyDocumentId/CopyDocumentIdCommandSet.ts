import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  type Command,
  type IListViewCommandSetExecuteEventParameters,
  type ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';
// import { Dialog } from '@microsoft/sp-dialog';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICopyDocumentIdCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'CopyDocumentIdCommandSet';

export default class CopyDocumentIdCommandSet extends BaseListViewCommandSet<ICopyDocumentIdCommandSetProperties> {

  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized CopyDocumentIdCommandSet');

    // initial state of the command's visibility
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    compareOneCommand.visible = false;

    this.context.listView.listViewStateChangedEvent.add(this, this._onListViewStateChanged);

    return Promise.resolve();
  }

  public async onExecute(event: IListViewCommandSetExecuteEventParameters): Promise<void> {
    switch (event.itemId) {
      case 'COMMAND_1':
        if (this.context.listView.selectedRows) {
          // copy document ID to clipboard    
          const selectedItem = this.context.listView.selectedRows[0];
          const documentId = selectedItem.getValueByName('_dlc_DocIdUrl.desc'); // internal name of the Document ID field

          await navigator.clipboard.writeText(documentId);

          // Dialog.alert(`Document ID ${documentId} copied to clipboard.`,).catch(() => {
          //   /* handle error */
          // });
        }

      break;
      throw new Error('Unknown command');
    }
  }

  private _onListViewStateChanged = (args: ListViewStateChangedEventArgs): void => {
    Log.info(LOG_SOURCE, 'List view state changed');

    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = this.context.listView.selectedRows?.length === 1;
    }

    // You can add additional logic here if needed
    
    // You should call this.raiseOnChage() to update the command bar
    this.raiseOnChange();
  }
}
