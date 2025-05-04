package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.Class;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClassRepository extends MongoRepository<Class, String> {
}
