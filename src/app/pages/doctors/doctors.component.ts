import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpecialistService } from '../../services/specialist.service';
import { Specialist } from '../../models/models';

export interface SpecialistCard {
  firstName: string;
  lastName: string;
  role: string;
  gender: 'male' | 'female';
  image: string;
  route: string;
}

// Visual enrichment not provided by the API (gender for Italian title, local image asset)
const SPECIALIST_ENRICHMENT: Record<string, { gender: 'male' | 'female'; image: string }> = {
  simona:    { gender: 'female', image: 'assets/icons/simona.webp'    },
  luca:      { gender: 'male',   image: 'assets/icons/luca.webp'      },
  sandro:    { gender: 'male',   image: 'assets/icons/sandro.webp'    },
  mihai:     { gender: 'male',   image: 'assets/icons/mihai.webp'     },
  michele:   { gender: 'male',   image: 'assets/icons/mihai.webp'     },
  cristiana: { gender: 'female', image: 'assets/icons/cristiana.webp' },
};

@Component({
  selector: 'app-doctors',
  imports: [],
  templateUrl: './doctors.component.html'
})
export class DoctorsComponent implements OnInit {
  private readonly specialistService = inject(SpecialistService);
  private readonly router            = inject(Router);

  specialists: SpecialistCard[] = [];
  loading = false;

  ngOnInit(): void {
    this.loading = true;
    this.specialistService.getAll().subscribe({
      next: (data) => { this.specialists = data.map(s => this.toCard(s)); this.loading = false; },
      error: ()    => { this.loading = false; }
    });
  }

  private toCard(s: Specialist): SpecialistCard {
    const key        = s.firstName.toLowerCase();
    const enrichment = SPECIALIST_ENRICHMENT[key] ?? { gender: 'male' as const, image: 'assets/icons/default.webp' };
    return {
      firstName: s.firstName,
      lastName:  s.lastName,
      role:      s.role,
      gender:    enrichment.gender,
      image:     enrichment.image,
      route:     `/specialist/${key}`,
    };
  }

  navigateTo(route: string): void { this.router.navigate([route]); }
}

