import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import { Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import View from 'ol/View';
import { Icon, Style } from 'ol/style';
import { Select } from 'ol/interaction';
import { IFeature } from '../../dto/map-feature/i-feature.dto';
import { MapBrowserEvent, Overlay } from 'ol';
import { FeatureLike } from 'ol/Feature';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-openlayer',
  templateUrl: './openlayer.component.html',
  styleUrls: ['./openlayer.component.css']
})
export class OpenlayerComponent implements OnInit, OnChanges {
  @Input() mapFeatures: IFeature[] = [];
  @Input() mapCenter: { longitude: number, latitude: number } = { longitude: 0, latitude: 0 };
  @Input() zoom: number = 10;
  @Output() onEvent = new EventEmitter();

  iconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      opacity: 0.95,
      src: 'assets/images/marker-online-lite.png',
    })
  })

  select = new Select();

  private __vectorSource: VectorSource = new VectorSource();
  private __vectorLayer: any;
  private __tileLayer = new TileLayer({ source: new OSM(), });
  private __map!: Map;

  private __pointerMoveEventSb: BehaviorSubject<any> = new BehaviorSubject(undefined);

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.mapInit();
    }, 500)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mapFeatures']) {
      this.__vectorSource.clear();

      this.mapFeatures.forEach((feature: IFeature) => {
        this.__vectorSource.addFeature(feature.getFeature())
      })
    }
  }

  mapInit() {
    /**
     * Elements that make up the popup.
     */
    const container = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const popupCloser = document.getElementById('popup-closer');

    /**
     * Create an overlay to anchor the popup to the map.
     */
    const overlay = new Overlay({
      element: container ? container : undefined,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    this.__vectorLayer = new VectorLayer({
      source: this.__vectorSource,
      style: this.iconStyle
    });

    this.__map = new Map({
      layers: [this.__tileLayer, this.__vectorLayer],
      overlays: [overlay],
      target: 'map',
      view: new View({
        center: fromLonLat([this.mapCenter.longitude, this.mapCenter.latitude]),
        zoom: this.zoom,
      }),
    });

    this.__map.on('pointermove', (event: MapBrowserEvent<any>) => {
      this.__pointerMoveEventSb.next(event)
    })
    this.__pointerMoveEventSb.pipe(debounceTime(10)).subscribe({
      next: (event: MapBrowserEvent<any>) => {
        if (event === undefined) return;
        let __features: FeatureLike[] = []
        this.__map.forEachFeatureAtPixel(event.pixel, (feature) => {
          __features.push(feature)
        });

        if (__features.length > 0) {
          const coordinate = event.coordinate;
          if (popupContent) {
            popupContent.innerHTML = `<div style='text-align: center'>${__features[0].get('data')?.name}</div>`;
          }
          overlay.setPosition(coordinate);
        } else {
          overlay.setPosition(undefined);
          popupCloser?.blur();
        }

        this.__onEvent(OpenlayerSenderEnum.pointermove, __features)
      }
    })

    this.__map.addInteraction(this.select);
    this.select.on('select', (e) => {
      if (e.selected.length > 0) {
        this.__onEvent(OpenlayerSenderEnum.select, e.selected)
        this.select.getFeatures().clear();
      }
    });
  }

  __onEvent(sender: any, event: any) {
    this.onEvent.emit({ sender: sender, event: event })
  }

}

export enum OpenlayerSenderEnum {
  select = 'OpenlayerSenderEnum_select',
  pointermove = 'OpenlayerSenderEnum_pointermove'
}
