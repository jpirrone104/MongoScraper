$(document).ready(function () {

  //function to post a comment to server
  function sendComment(element) {
    let comment = {};
    comment.articleId = $(element).attr('data-id'),
    comment.title = $('#commentTitleEntry').val().trim();
    comment.body = $('#commentBodyEntry').val().trim();
    if (comment.title && comment.body){
      $.ajax({
        url: '/comments/createComment',
        type: 'POST',
        data: comment,
        success: function (response){
          showComment(response, comment.articleId);
          $('#commentBodyEntry, #commentTitleEntry').val('');
        },
        error: function (error) {
          showErrorModal(error);
        }
      });
    }
  }//end of sendComment function


  //function to display error modal on ajax error
  function showErrorModal(error) {
    $('#error').modal('show');
  }


  //function to display comments in commentmodal
  function showComment(element, articleId){
    let $title = $('<p>')
      .text(element.title)
      .addClass('commentTitle');
    let $deleteButton = $('<button>')
      .text('X')
      .addClass('deleteComment');
    let $comment = $('<div>')
      .append($deleteButton, $title)
      .attr('data-comment-id', element._id)
      .attr('data-article-id', articleId)
      .addClass('comment')
      .appendTo('#commentArea');
  }//end of showComment function

  //event listener to reload root when user closes modal showing
  //number of scraped articles
  $('#alertModal').on('hide.bs.modal', function (e) {
    window.location.href = '/';
  });

  //click event to scrape new articles
  $('#scrape').on('click', function (e){
    e.preventDefault();
    $.ajax({
      url: '/scrape/newArticles',
      type: 'GET',
      success: function (response) {
        $('#numArticles').text(response.count);
      },
      error: function (error) {
        showErrorModal(error);
      },
      complete: function (result){
        $('#alertModal').modal('show');
      }
    });
  });//end of #scrape click event

  //click event to save an article
  $(document).on('click', '.saveArticle', function (e) {
    let articleId = $(this).data('id');
    $.ajax({
      url: '/articles/save/'+articleId,
      type: 'GET',
      success: function (response) {
        window.location.href = '/';
      },
      error: function (error) {
        showErrorModal(error);
      }
    });
  });//end of #saveArticle click event

  //click event to open comment modal and populate with comments
  $('.addComment').on('click', function (e){
    $('#commentArea').empty();
    $('#commentTitleEntry, #commentBodyEntry').val('');
    let id = $(this).data('id');
    $('#submitComment, #commentBodyEntry').attr('data-id', id);
    $.ajax({
      url: '/comments/getComments/'+id,
      type: 'GET',
      success: function (data){
        $.each(data.comments, function (i, item){
          showComment(item, id);
        });
        $('#commentModal').modal('show');
      },
      error: function (error) {
        showErrorModal(error);
      }
    });
  });//end of .addComment click event

  //click event to create a comment
  $('#submitComment').on('click', function (e) {
    e.preventDefault();
    sendComment($(this));
  });//end of #submitComment click event

  //keypress event to allow user to submit comment with enter key
  $('#commentBodyEntry').on('keypress', function (e) {
    if(e.keyCode === 13){
      sendComment($(this));
    }
  });//end of #commentBodyEntry keypress(enter) event

  //click event to delete an article from savedArticles
  $('.deleteArticle').on('click', function (e){
    e.preventDefault();
    let id = $(this).data('id');
    $.ajax({
      url: '/articles/deleteArticle/'+id,
      type: 'DELETE',
      success: function (response) {
        window.location.href = '/articles/viewSaved';
      },
      error: function (error) {
        showErrorModal(error);
      }
    });
  });//end of .deleteArticle click event

  //click event to delete a comment from a saved article
  $(document).on('click', '.deleteComment', function (e){
    e.stopPropagation();
    let thisItem = $(this);
    let ids= {
      commentId: $(this).parent().data('comment-id'),
      articleId: $(this).parent().data('article-id')
    };

    $.ajax({
      url: '/comments/deleteComment',
      type: 'POST',
      data: ids,
      success: function (response) {
        thisItem.parent().remove();
      },
      error: function (error) {
        showErrorModal(error);
      }
    });
  });//end of .deleteComment click event

  //click event to retrieve the title and body of a single comment
  //and populate the comment modal inputs with it
  $(document).on('click', '.comment', function (e){
    e.stopPropagation();
    let id = $(this).data('comment-id');
    $.ajax({
      url: '/comments/getSingleComment/'+id,
      type: 'GET',
      success: function (comment) {
        $('#commentTitleEntry').val(comment.title);
        $('#commentBodyEntry').val(comment.body);
      },
      error: function (error) {
        console.log(error);
        showErrorModal(error);
      }
    });
  }); //end of .comment click event

});//end of document ready function
