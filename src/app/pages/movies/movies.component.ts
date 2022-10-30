import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie, MovieDto } from 'src/app/models/movie';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  movieDto: MovieDto | null = null;
  genreId: string | null = null;
  searchValue: string = '';

  constructor(private moviesService: MoviesService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ genreId }) => {
      this.genreId = genreId;

      if (genreId) {
        this.getMoviesPageByGenre(genreId, 1);
      } else {
        this.getMoviesPage(1);
      }
    });
  }

  getMoviesPage(page: number, searchValue?: string) {
    this.moviesService.searchMoviesPage(page, searchValue).subscribe((response) => {
      this.movieDto = response;
      if (this.movieDto.total_results > 10000) {
        this.movieDto.total_results = 10000;
      }
      this.movies = response.results;
    });
  }

  getMoviesPageByGenre(genreId: string, page: number) {
    this.moviesService.getMoviesPageByGenre(genreId, page).subscribe((response) => {
      this.movieDto = response;
      if (this.movieDto.total_results > 10000) {
        this.movieDto.total_results = 10000;
      }
      this.movies = response.results;
    });
  }

  paginate(event: any) {
    const page = event.page + 1;
    if (this.genreId) {
      this.getMoviesPageByGenre(this.genreId, page);
    } else {
      this.getMoviesPage(page, this.searchValue);
    }
  }

  searchChange() {
    this.getMoviesPage(1, this.searchValue);
  }
}
