/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Map, IControl } from 'mapbox-gl'
import Buffer from '@turf/buffer'

interface Parameters {
  featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
  radius: number;
  forbiddenAreaConfiguration: any;
}

export default class MapboxForbiddenAreaControl implements IControl {
  private map: Map | undefined;
  private forbiddenAreaControl: HTMLElement | undefined;
  private cursor: any;
  private featureCollection: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
    type: 'FeatureCollection',
    features: [],
  };

  private radius = 1;
  private forbiddenAreaConfiguration: any = {
    sourceId: 'forbidden-area',
    layerId: 'forbidden-area',
    layerConfiguration: { paint: { 'fill-opacity': 0 } },
  };

  constructor (parameters: Parameters | undefined) {
    if (parameters) {
      const { featureCollection, radius, forbiddenAreaConfiguration } =
        parameters
      if (featureCollection) {
        this.featureCollection = featureCollection
      }
      if (radius) {
        this.radius = radius
      }
      if (forbiddenAreaConfiguration) {
        this.forbiddenAreaConfiguration = {
          ...this.forbiddenAreaConfiguration,
          ...forbiddenAreaConfiguration,
        }
      }
    }
  }

  public onAdd (currentMap: Map): HTMLElement {
    this.map = currentMap
    this.forbiddenAreaControl = this.createUI()
    this.map.once('idle', this.configureMap)
    return this.forbiddenAreaControl
  }

  public onRemove (): void {
    this.map!.off('idle', this.configureMap)
    if (this.forbiddenAreaControl) {
      this.forbiddenAreaControl.remove()
    }
  }

  private createUI (): HTMLDivElement {
    const forbiddenAreaControlContainer = document.createElement('div')

    return forbiddenAreaControlContainer
  }

  private configureMap = (): void => {
    this.initializeSourceAndLayers()
    this.initializeEvents()
    this.map!.fire('mouseup', { point: { x: undefined, y: undefined } })
  };

  private initializeSourceAndLayers (): void {
    const buffer = Buffer(this.featureCollection!, this.radius)

    this.map!.addSource(this.forbiddenAreaConfiguration.sourceId, {
      type: 'geojson',
      data: buffer,
      promoteId: 'id',
    })
    this.map!.addLayer({
      id: this.forbiddenAreaConfiguration.layerId,
      type: 'fill',
      source: this.forbiddenAreaConfiguration.sourceId,
      ...this.forbiddenAreaConfiguration.layerConfiguration,
    })
  }

  private initializeEvents (): void {
    const disable = (e: any) => {
      e.stopPropagation()
      e.preventDefault()
    }

    this.map!.on('mouseenter', this.forbiddenAreaConfiguration.layerId, (e) => {
      this.map!.fire('mouseup', e)
      this.handleMapCursor('not-allowed')
      this.map!.getCanvas().addEventListener('mouseup', disable, true)
    })
    this.map!.on('mouseleave', this.forbiddenAreaConfiguration.layerId, () => {
      this.handleMapCursor(this.cursor)
      this.map!.getCanvas().removeEventListener('mouseup', disable, true)
    })
  }

  private handleMapCursor (cursor: string): void {
    this.cursor = this.map!.getCanvas().style.cursor
    this.map!.getCanvas().style.cursor = cursor
  }
}
