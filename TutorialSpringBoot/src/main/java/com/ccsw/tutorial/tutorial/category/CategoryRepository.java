package com.ccsw.tutorial.tutorial.category;

import com.ccsw.tutorial.tutorial.category.model.Category;
import org.springframework.data.repository.CrudRepository;

/**
 * @author ccsw
 *
 */
public interface CategoryRepository extends CrudRepository<Category, Long> {

}