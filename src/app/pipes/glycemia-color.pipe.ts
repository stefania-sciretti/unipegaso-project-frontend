import {Pipe, PipeTransform} from '@angular/core';
import {GlycemiaClassification} from '../models/models';

const CLASSIFICATION_CSS: Record<GlycemiaClassification, string> = {
  NORMALE:    'badge-success',
  ATTENZIONE: 'badge-warning',
  ELEVATA:    'badge-danger'
};

/**
 * Maps a glycemia classification string to its CSS badge class.
 *
 * Extracted from GlycemiaComponent.classColor() (Single Responsibility Principle).
 *
 * Usage: {{ measurement.classification | glycemiaColor }}
 */
@Pipe({ name: 'glycemiaColor', standalone: true })
export class GlycemiaColorPipe implements PipeTransform {
  transform(classification: string): string {
    return CLASSIFICATION_CSS[classification as GlycemiaClassification] ?? 'badge-secondary';
  }
}
