import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './MySharePointListWebPart.module.scss';
import * as strings from 'MySharePointListWebPartStrings';

export interface IMySharePointListWebPartProps {
  description: string;
}

import MockHttpClient from './MockHttpClient'; 

import {  
  SPHttpClient, SPHttpClientResponse  
} from '@microsoft/sp-http'; 

import {  
  Environment,  
  EnvironmentType  
} from '@microsoft/sp-core-library';  

export interface IGetSpListItemsWebPartProps {
  description: string;
}

export interface ISPLists {  
  value: ISPList[];  
}

export interface ISPList {  
  Tytuł: string;  
  Opis: string;  
  Cena: Number;  
} 

export default class MySharePointListWebPart extends BaseClientSideWebPart<IMySharePointListWebPartProps> {

  public render(): void {  
    this.domElement.innerHTML = `  
    <div class="${styles.title}">  
    <div class="${styles.container}">  
    <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">  
    <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1" style="text-align: center">  
       <span class="ms-font-xl ms-fontColor-white" style="font-size:28px" >Predica</span>  
         
       <p class="ms-font-l ms-fontColor-white" style="text-align: center">My recruitment task</p>  
     </div>  
   </div>  
   <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">  
   <div style="background-color:Black;color:white;text-align: center;font-weight: bold;font-size:18px;">Dane</div>  
   <br>  
  <div id="spListContainer" />  
    </div>  
  </div>  
  </div>`
  ;  

this._renderListAsync();  
 }  

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }

  private _renderListAsync(): void {  
      
    if (Environment.type === EnvironmentType.Local) {  
      this._getMockListData().then((response) => {  
        this._renderList(response.value);  
      });  
    }  
     else {  
       this._getListData()  
      .then((response) => {  
        this._renderList(response.value);  
      });  
   }  
}  

  
  private _getMockListData(): Promise<ISPLists> {  
    return MockHttpClient.get(this.context.pageContext.web.absoluteUrl).then(() => {  
        const listData: ISPLists = {  
            value:  
            [  
                { Tytuł: '1', Opis: 'Test1', Cena: 1.1},  
                { Tytuł: '2', Opis: 'Test2', Cena: 2.2} 
            ]  
            };  
        return listData;  
    }) as Promise<ISPLists>;  
  }

  private _getListData(): Promise<ISPLists> {  
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('EmployeeList')/Items`, SPHttpClient.configurations.v1)  
        .then((response: SPHttpClientResponse) => {   
          debugger;  
          return response.json();  
        });  
    }   

  
  private _renderList(items: ISPList[]): void {  
    let html: string = '<table class="TFtable" border=1 width=100% style="border-collapse: collapse;">';  
    html += `<th>Tytuł</th><th>Opis</th><th>Cena</th>`;  
    items.forEach((item: ISPList) => {  
      html += `  
           <tr>  
          <td>${item.Tytuł}</td>  
          <td>${item.Opis}</td>  
          <td>${item.Cena}</td>  
          </tr>  
          `;  
    });  
    html += `</table>`;  
    const listContainer: Element = this.domElement.querySelector('#spListContainer');  
    listContainer.innerHTML = html;  
  }
}