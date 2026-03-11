import { IStaticMethods } from "flyonui/flyonui";

declare global {
  interface Window {
    _: any;
    $: any;
    jQuery: any;
    DataTable: any;
    Dropzone: any;

    HSStaticMethods: IStaticMethods;
  }
}

export {};