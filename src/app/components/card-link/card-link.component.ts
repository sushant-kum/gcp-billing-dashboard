import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-link',
  templateUrl: './card-link.component.html',
  styleUrls: ['./card-link.component.scss']
})
export class CardLinkComponent implements OnInit {
  @Input() app: {
    path: string;
    identifier: string;
    name: string;
    short_name: string;
    img_icon_theme: string;
    img_icon_white: string;
    fas_icon: string;
    hovered: boolean;
  };

  constructor() {}

  ngOnInit() {}

  onCardMouseOver() {
    this.app.hovered = true;
  }

  onCardMouseOut() {
    this.app.hovered = false;
  }
}
