import * as mapSel from '../selectors/map';

import { AirwaysCtrlElement, AirwaysOverlay } from './airways-element';
import { CSSResult, LitElement, TemplateResult, css, customElement, html, property } from 'lit-element';
import { RootState, store } from '../store';
import { closeActiveTrack, setAspAltitude, setAspShowRestricted, setCurrentTrack } from '../actions/map';

import { AboutElement } from './about-element';
import { AirspaceCtrlElement } from './airspace-element';
import { DashboardElement } from './dashboard-element';
import { ExpandElement } from './expand-element';
import { Fixes } from '../logic/map';
import { NameElement } from './name-element';
import { PathCtrlElement } from './path-element';
import { PreferencesElement } from './preferences-element';
import { Track } from '../logic/map';
import { TrackingElement } from './tracking-element';
import { UploadElement } from './upload-element';
import { connect } from 'pwa-helpers';

export {
  AboutElement,
  AirspaceCtrlElement,
  AirwaysCtrlElement,
  AirwaysOverlay,
  DashboardElement,
  ExpandElement,
  NameElement,
  PathCtrlElement,
  PreferencesElement,
  TrackingElement,
  UploadElement,
};

@customElement('controls-element')
export class ControlsElement extends connect(store)(LitElement) {
  @property({ attribute: false })
  aspAltitude = 1;

  @property({ attribute: false })
  aspShowRestricted = true;

  @property({ attribute: false })
  map: google.maps.Map | null = null;

  @property({ attribute: false })
  timestamp = 0;

  @property({ attribute: false })
  fixes: Fixes | null = null;

  @property({ attribute: false })
  name: string | null = null;

  @property({ attribute: false })
  tracks: Track[] | null = null;

  @property({ attribute: false })
  units: { [type: string]: string } | null = null;

  @property({ attribute: false })
  currentTrack: number | null = null;

  isInIframe = window.parent !== window;

  stateChanged(state: RootState): void {
    if (state.map) {
      this.aspAltitude = state.map.aspAltitude;
      this.aspShowRestricted = state.map.aspShowRestricted;
      this.map = state.map.map;
      this.timestamp = state.map.ts;
      this.fixes = mapSel.activeFixes(state.map);
      this.name = mapSel.name(state.map);
      this.tracks = mapSel.tracks(state.map);
      this.units = state.map.units;
      this.currentTrack = state.map.currentTrack;
    }
  }

  static get styles(): CSSResult[] {
    return [
      css`
        :host {
          display: block;
          font: 12px 'Nobile', verdana, sans-serif;
          height: 1px;
        }
      `,
    ];
  }

  // Set the ceiling altitude to display airspaces.
  protected handleAltitudeChange(e: CustomEvent): void {
    store.dispatch(setAspAltitude(e.detail.altitude));
  }

  // Show/hide restricted airspaces.
  protected handleRestricted(e: CustomEvent): void {
    store.dispatch(setAspShowRestricted(e.detail.show));
  }

  // Closes the current track.
  protected handleClose(): void {
    store.dispatch(closeActiveTrack());
  }

  // Activates the next track.
  protected handleNext(): void {
    if (this.currentTrack != null && this.tracks != null) {
      const index = (this.currentTrack + 1) % this.tracks.length;
      store.dispatch(setCurrentTrack(index));
    }
  }

  protected render(): TemplateResult {
    return html`
      ${this.isInIframe ? html`<expand-ctrl-element></expand-ctrl-element>` : html``}
      <airspace-ctrl-element
        .map=${this.map}
        .altitude=${this.aspAltitude}
        .restricted=${this.aspShowRestricted}
        @change=${this.handleAltitudeChange}
        @restricted=${this.handleRestricted}
      ></airspace-ctrl-element>
      <airways-ctrl-element .map=${this.map}></airways-ctrl-element>
      <path-ctrl-element .map=${this.map}></path-ctrl-element>
      <upload-ctrl-element></upload-ctrl-element>
      <tracking-element .map=${this.map}></tracking-element>
      <preferences-ctrl-element></preferences-ctrl-element>
      <about-ctrl-element></about-ctrl-element>
      ${this.name
        ? html`
            <name-ctrl-element
              .name=${this.name}
              .index=${this.currentTrack}
              .nbtracks=${this.tracks?.length || 0}
              @closeActiveTrack=${this.handleClose}
              @selectNextTrack=${this.handleNext}
            ></name-ctrl-element>
          `
        : ''}
      ${this.fixes
        ? html`
            <dashboard-ctrl-element
              .fixes=${this.fixes}
              .timestamp=${this.timestamp}
              .units=${this.units}
            ></dashboard-ctrl-element>
          `
        : ''}
    `;
  }
}
