import { makeAutoObservable } from "mobx";

class LayoutStore {
  private _showControl: boolean = false;
  private _showFavorite: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  get isShowControl() {
    return this._showControl;
  }
  toggleControl = () => {
    this._showControl = !this._showControl;
  };

  get isShowFavorite() {
    return this._showFavorite;
  }
  toggleFavorite = () => {
    this._showFavorite = !this._showFavorite;
  };
}


export const layoutStore = new LayoutStore();

 