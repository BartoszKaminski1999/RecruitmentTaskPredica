import { ISPList } from './MySharePointListWebPart';  
  
export default class MockHttpClient {  
    private static _items: ISPList[] = [{ Tytuł: '1', Opis: 'Test1', Cena: 1.1  },];  
    public static get(restUrl: string, options?: any): Promise<ISPList[]> {  
      return new Promise<ISPList[]>((resolve) => {  
            resolve(MockHttpClient._items);  
        });  
    }  
} 