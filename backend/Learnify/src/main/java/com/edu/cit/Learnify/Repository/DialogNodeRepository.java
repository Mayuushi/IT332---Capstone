package com.edu.cit.Learnify.Repository;

import com.edu.cit.Learnify.Entity.DialogNode;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DialogNodeRepository extends MongoRepository<DialogNode, String> {
}
